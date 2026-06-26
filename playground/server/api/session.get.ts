import { randomBytes } from "node:crypto";

export default defineEventHandler(() => {
  const sessionId = randomBytes(16).toString("hex");

  return sessionId;
});
