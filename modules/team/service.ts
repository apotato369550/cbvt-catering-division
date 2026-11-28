import { DomainError } from "@/lib/result";
import * as repo from "./repository";
import type { Role, UserItem, WorkspaceSettings } from "./types";

type UserRow = Awaited<ReturnType<typeof repo.findAllUsers>>[number];

function toUserItem(row: UserRow): UserItem {
  return { ...row, role: row.role as Role };
}

export async function listUsers(): Promise<UserItem[]> {
  return (await repo.findAllUsers()).map(toUserItem);
}

export async function getUserById(id: string): Promise<UserItem | null> {
  const row = await repo.findUserById(id);
  return row ? toUserItem(row) : null;
}

// TEMPORARY until LOG-4: pretends the first admin is signed in.
export async function getCurrentUser(): Promise<UserItem> {
  const row = await repo.findFirstActiveAdmin();
  if (!row) {
    throw new DomainError("No admin user found. Run `npx prisma db seed`.");
  }
  return toUserItem(row);
}

const defaultSettings: WorkspaceSettings = {
  workspaceName: "CBVT Kitchen",
  prepRemindersEnabled: true,
  requirePoApproval: false,
};

export async function getSettings(): Promise<WorkspaceSettings> {
  return (await repo.findSettings()) ?? { ...defaultSettings };
}

export async function updateSettings(
  input: WorkspaceSettings,
): Promise<WorkspaceSettings> {
  const workspaceName =
    typeof input?.workspaceName === "string" ? input.workspaceName.trim() : "";
  if (!workspaceName) throw new DomainError("Workspace name is required.");

  const { prepRemindersEnabled, requirePoApproval } = input;
  if (
    typeof prepRemindersEnabled !== "boolean" ||
    typeof requirePoApproval !== "boolean"
  ) {
    throw new DomainError("Workspace preferences must be on or off.");
  }

  return repo.upsertSettings({
    workspaceName,
    prepRemindersEnabled,
    requirePoApproval,
  });
}
