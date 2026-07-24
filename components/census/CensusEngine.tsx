// Census / CensusEngine (PRD §4.2). Orchestrates the whole King's Census: one screen at a time,
// chapter-level progress, auto-advance vs Next, capped acknowledgments, mid/near-end nudges, name
// reuse, resumability (localStorage + server), gentle validation, and the emotional ending.
//
// Persistence model: answers live in localStorage for instant same-device resume. Once the email is
// known, each advance also upserts to the server (POST /api/census) so partial records show in admin
// and dedupe by email. Completion (PATCH /api/census) promotes the Member to King and sends Welcome.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CENSUS_CHAPTERS, CENSUS_VERSION } from "@/lib/census/questions";
import { buildSequence, validate, type Screen } from "@/lib/census/sequence";
import { acknowledgment } from "@/lib/census/copy";
import {
  loadDraft,
  saveDraft,
  clearDraft,
  saveKingName,
  loadPendingKingsHour,
  clearPendingKingsHour,
} from "@/lib/census/storage";
import { track, AnalyticsEvent } from "@/lib/analytics/events";
import { ChapterShell } from "./ChapterShell";
import { ChapterIntro } from "./ChapterIntro";
import { QuestionScreen } from "./QuestionScreen";
import { EncouragementInterstitial } from "./EncouragementInterstitial";
import { AcknowledgmentToast } from "./AcknowledgmentToast";
import { CelebrationScreen } from "./CelebrationScreen";

const TOTAL_CHAPTERS = 6;

export function CensusEngine() {
  const sequence = useMemo(() => buildSequence(), []);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [ack, setAck] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [existingKing, setExistingKing] = useState(false);
  const memberIdRef = useRef<string | undefined>(undefined);
  const pendingSessionIdRef = useRef<string | undefined>(undefined);
  const shownAcks = useRef<Set<string>>(new Set());
  const finalized = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  // Always-current answers, so an auto-advance callback that fires ~160ms after selection reads the
  // just-picked value (not a stale closure). State drives render; this ref drives advance decisions.
  const answersRef = useRef<Record<string, unknown>>({});

  // Resume from a saved draft on mount.
  useEffect(() => {
    const draft = loadDraft();
    const pendingKingsHour = loadPendingKingsHour();
    const querySessionId =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get("session");
    if (draft) {
      const restored = draft.answers ?? {};
      if (pendingKingsHour?.email && !restored.email) restored.email = pendingKingsHour.email;
      setAnswers(restored);
      answersRef.current = restored;
      setIndex(Math.min(draft.screenIndex ?? 0, sequence.length - 1));
      memberIdRef.current = draft.memberId;
      pendingSessionIdRef.current = draft.pendingSessionId ?? pendingKingsHour?.sessionId ?? querySessionId ?? undefined;
    } else if (pendingKingsHour?.email || querySessionId) {
      const restored = pendingKingsHour?.email ? { email: pendingKingsHour.email } : {};
      setAnswers(restored);
      answersRef.current = restored;
      pendingSessionIdRef.current = pendingKingsHour?.sessionId ?? querySessionId ?? undefined;
    }
    setHydrated(true);
    track(AnalyticsEvent.CENSUS_START);
  }, [sequence.length]);

  // Greetings use the first token only, so a 2–3 word entry never breaks the copy.
  const firstName =
    typeof answers.first_name === "string"
      ? (answers.first_name as string).trim().split(/\s+/)[0] || undefined
      : undefined;

  const screen = sequence[index];
  const chapter = screen?.chapter ?? 1;
  const chapterName = CENSUS_CHAPTERS.find((c) => c.index === chapter)?.name ?? "";
  const chapterLabel = `Chapter ${Math.min(chapter, TOTAL_CHAPTERS)} — ${chapterName}`;
  const percent =
    screen?.kind === "celebration"
      ? 100
      : Math.round((index / Math.max(sequence.length - 1, 1)) * 100);

  // Persist the current draft locally, and to the server once we have an email.
  const persist = useCallback(
    (nextAnswers: Record<string, unknown>, nextIndex: number, completed = false) => {
      // Completion owns the local cleanup. Saving before or after its request can race with
      // clearDraft() and accidentally restore the celebration screen on the next visit.
      if (!completed) {
        saveDraft({
          answers: nextAnswers,
          screenIndex: nextIndex,
          memberId: memberIdRef.current,
          pendingSessionId: pendingSessionIdRef.current,
          updatedAt: Date.now(),
        });
      }
      const email = nextAnswers.email;
      if (typeof email !== "string" || !email.includes("@")) return; // not enough to save server-side yet
      const current = sequence[nextIndex];
      const body = {
        memberId: memberIdRef.current,
        version: CENSUS_VERSION,
        answers: nextAnswers,
        currentScreen: current?.kind === "question" ? current.question.id : current?.kind,
        chapter: current?.chapter ?? chapter,
        completed,
        sessionId: pendingSessionIdRef.current,
      };
      const method = completed ? "PATCH" : "POST";
      fetch("/api/census", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.memberId) {
            memberIdRef.current = data.memberId;
            if (!completed) {
              saveDraft({
                answers: nextAnswers,
                screenIndex: nextIndex,
                memberId: data.memberId,
                pendingSessionId: pendingSessionIdRef.current,
                updatedAt: Date.now(),
              });
            }
          }
        })
        .catch(() => {
          // No keys / offline: the UI still works; server persistence resumes when configured.
        });
    },
    [sequence, chapter],
  );

  const advance = useCallback(
    (nextAnswers: Record<string, unknown>) => {
      const nextIndex = Math.min(index + 1, sequence.length - 1);
      setError(null);
      setIndex(nextIndex);
      persist(nextAnswers, nextIndex);
    },
    [index, sequence.length, persist],
  );

  const setAnswer = useCallback((id: string, value: unknown) => {
    const next = { ...answersRef.current, [id]: value };
    answersRef.current = next; // sync immediately so auto-advance sees the latest value
    setAnswers(next);
    setError(null);
  }, []);

  // Advance from a question: validate, maybe show a capped acknowledgment, then move on.
  const goNextFromQuestion = useCallback(() => {
    if (screen?.kind !== "question") return;
    const q = screen.question;
    const value = answersRef.current[q.id];
    const err = validate(q, value);
    if (err) {
      setError(err);
      return;
    }
    const nextAnswers = { ...answersRef.current };

    if (q.id === "email") {
      const nextIndex = Math.min(index + 1, sequence.length - 1);
      const current = sequence[nextIndex];
      setCheckingEmail(true);
      fetch("/api/census", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            memberId: memberIdRef.current,
            sessionId: pendingSessionIdRef.current,
            version: CENSUS_VERSION,
            answers: nextAnswers,
          currentScreen: current?.kind === "question" ? current.question.id : current?.kind,
          chapter: current?.chapter ?? chapter,
          completed: false,
        }),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error("Email check failed");
          return response.json();
        })
        .then((data) => {
          if (data?.existingKing) {
            saveKingName(firstName);
            clearDraft();
            setExistingKing(true);
            return;
          }

          if (data?.memberId) memberIdRef.current = data.memberId;
          setIndex(nextIndex);
          saveDraft({
            answers: nextAnswers,
            screenIndex: nextIndex,
            memberId: memberIdRef.current,
            pendingSessionId: pendingSessionIdRef.current,
            updatedAt: Date.now(),
          });
        })
        .catch(() => {
          // If the status check is unavailable, preserve the Census's offline-friendly behavior.
          // The server guard still protects an existing King when persistence resumes.
          advance(nextAnswers);
        })
        .finally(() => setCheckingEmail(false));
      return;
    }

    const ackLine = acknowledgment(q.id, value, firstName);
    if (ackLine && !shownAcks.current.has(q.id)) {
      shownAcks.current.add(q.id);
      setAck(ackLine);
      setTimeout(() => {
        setAck(null);
        advance(nextAnswers);
      }, 1400);
      return;
    }
    advance(nextAnswers);
  }, [screen, firstName, advance, index, sequence, chapter]);

  const goBack = useCallback(() => {
    setError(null);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Finalize when the celebration screen is reached (promote to King + send Welcome).
  useEffect(() => {
    if (screen?.kind === "celebration" && !finalized.current) {
      finalized.current = true;
      persist(answers, index, true);
      track(AnalyticsEvent.CENSUS_COMPLETE);
      saveKingName(firstName); // keep the name so /welcome can greet them
      clearDraft(); // the journey is done; drop the local draft
      clearPendingKingsHour();
    }
  }, [screen, answers, index, persist, firstName]);

  useEffect(() => {
    if (screen?.kind === "question") {
      track(AnalyticsEvent.CENSUS_SCREEN_VIEW, { questionId: screen.question.id, chapter });
    }
  }, [screen, chapter]);

  if (!hydrated) return null; // avoid a hydration flash before we know resume state

  const content = renderScreen(screen);

  return (
    <div className="flex min-h-[70vh] w-full items-start justify-center">
      {screen?.kind === "celebration" ? (
        <div className="w-full max-w-xl anim-fade-up">{content}</div>
      ) : (
        <ChapterShell chapter={chapter} totalChapters={TOTAL_CHAPTERS} percent={percent}>
          {content}
        </ChapterShell>
      )}
      {ack && <AcknowledgmentToast message={ack} />}
    </div>
  );

  function renderScreen(s: Screen | undefined) {
    if (!s) return null;
    switch (s.kind) {
      case "intro":
        return (
          <ChapterIntro
            chapter={s.chapter}
            firstName={firstName}
            chapterLabel={chapterLabel}
            onContinue={() => advance(answers)}
          />
        );
      case "question":
        return (
          <QuestionScreen
            question={s.question}
            value={answers[s.question.id]}
            error={error}
            checking={checkingEmail}
            existingKing={existingKing}
            chapterLabel={chapterLabel}
            context={answers}
            onChange={(v) => setAnswer(s.question.id, v)}
            onAutoAdvance={goNextFromQuestion}
            onNext={goNextFromQuestion}
            onBack={goBack}
            canGoBack={index > 0}
            isLast={index >= sequence.length - 2}
          />
        );
      case "interstitial":
        return (
          <EncouragementInterstitial
            placement={s.placement}
            firstName={firstName}
            onContinue={() => advance(answers)}
          />
        );
      case "celebration":
        return <CelebrationScreen firstName={firstName} />;
    }
  }
}
