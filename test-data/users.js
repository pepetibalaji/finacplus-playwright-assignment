import { randomUUID } from "node:crypto";

export function createUserData() {
  return {
    name: `qa-user-${randomUUID()}`,
    job: "QA Automation Engineer",
  };
}
