import { db } from "@/lib/db";

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

// Used only by sign-in. This is the ONLY query that selects passwordHash.
export function findUserForLogin(email: string) {
  return db.user.findUnique({
    where: { email },
    select: { ...publicFields, passwordHash: true },
  });
}
