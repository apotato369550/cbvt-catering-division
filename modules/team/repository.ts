import { db } from "@/lib/db";
import type { WorkspaceSettings } from "./types";

// passwordHash is never selected here. LOG-1 adds its own query for sign-in.
const publicFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
} as const;

export function findAllUsers() {
  return db.user.findMany({ select: publicFields, orderBy: { name: "asc" } });
}

export function findUserById(id: string) {
  return db.user.findUnique({ where: { id }, select: publicFields });
}

export function findFirstActiveAdmin() {
  return db.user.findFirst({
    where: { role: "ADMIN", isActive: true },
    select: publicFields,
    orderBy: { createdAt: "asc" },
  });
}

const settingsId = "default";
const settingsFields = {
  workspaceName: true,
  prepRemindersEnabled: true,
  requirePoApproval: true,
} as const;

export function findSettings() {
  return db.workspaceSetting.findUnique({
    where: { id: settingsId },
    select: settingsFields,
  });
}

export function upsertSettings(settings: WorkspaceSettings) {
  return db.workspaceSetting.upsert({
    where: { id: settingsId },
    create: { id: settingsId, ...settings },
    update: settings,
    select: settingsFields,
  });
}
