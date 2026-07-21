// Kingsway — email template registry (PRD §4.4, five V1 templates).
export * from "./types";
export { welcomeEmail } from "./welcome";
export { invitationEmail, type InvitationData } from "./invitation";
export { reminderEmail, type ReminderData } from "./reminder";
export { followUpEmail, type FollowUpData } from "./followUp";
export { updateEmail, type UpdateData } from "./update";
