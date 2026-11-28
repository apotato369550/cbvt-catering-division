// Cookie helpers. createSession and clearSession can only be called from
// server actions and route handlers (Next.js does not allow cookie writes in pages).
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_DEFAULT_SECONDS,
  SESSION_REMEMBER_SECONDS,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "./session-token";

export async function createSession(
  userId: string,
  options: { remember?: boolean } = {},
): Promise<void> {
  const remember = options.remember ?? false;
  const maxAge = remember ? SESSION_REMEMBER_SECONDS : SESSION_DEFAULT_SECONDS;
  const token = await signSessionToken({ userId }, maxAge);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript in the browser cannot read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // "Remember me" = cookie survives closing the browser. Otherwise it is a session cookie.
    ...(remember ? { maxAge } : {}),
  });
}

// Who is signed in? Returns null when nobody is, or the cookie is invalid or expired.
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
