import { DomainError } from "@/lib/result";
import * as repo from "./repository";
import { INVALID_LOGIN_MESSAGE, type Role, type UserItem } from "./types";
import bcrypt from "bcryptjs";

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

// Compared against when the email is unknown, so "unknown email"
// takes as long as "wrong password".
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function authenticate(
  email: string,
  password: string,
): Promise<UserItem> {
  const normalized = (email ?? "").trim().toLowerCase();
  if (!normalized || !password || password.length > 200) {
    throw new DomainError(INVALID_LOGIN_MESSAGE);
  }

  const row = await repo.findUserForLogin(normalized);
  const passwordOk = await bcrypt.compare(
    password,
    row?.passwordHash ?? DUMMY_HASH,
  );

  if (!row || !row.isActive || !passwordOk) {
    throw new DomainError(INVALID_LOGIN_MESSAGE);
  }

  // Built field by field so passwordHash can never leak out.
  return toUserItem({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    isActive: row.isActive,
  });
}
