import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kingsway — a community for young builders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function CrownMark() {
  return (
    <svg width="56" height="42" viewBox="0 0 20 15" fill="none">
      <path
        d="M1.5 13.2 3 4.2l4 4 3-6 3 6 4-4 1.5 9z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <rect x="1.5" y="12.4" width="17" height="2.1" rx="0.6" fill="currentColor" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px 58px",
          background: "#FCFCFA",
          color: "#17152E",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ display: "flex", color: "#BC7C33" }}>
              <CrownMark />
            </div>
            <span style={{ fontSize: "34px", fontWeight: 600, letterSpacing: "-0.5px" }}>
              Kingsway
            </span>
          </div>
          <span
            style={{
              fontSize: "16px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#686579",
            }}
          >
            A community of builders
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "52px" }}>
          <div
            style={{
              width: "104px",
              height: "104px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
              borderRadius: "999px",
              background: "#17152E",
              color: "#FCFCFA",
            }}
          >
            <CrownMark />
          </div>
          <div
            style={{
              maxWidth: "820px",
              display: "flex",
              fontSize: "76px",
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-2.6px",
            }}
          >
            Whatever you’re building, you don’t have to do it alone.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "160px",
              height: "1px",
              borderTop: "3px dotted #BC7C33",
            }}
          />
          <span
            style={{
              fontSize: "15px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#686579",
            }}
          >
            Do it the King’s way
          </span>
        </div>
      </div>
    ),
    size,
  );
}
