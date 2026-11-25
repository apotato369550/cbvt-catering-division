// Signing and verifying the session token.
// No Next.js imports on purpose: route protection (LOG-3) can import this too.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "cbvt_session";
export const SESSION_DEFAULT_SECONDS = 60 * 60 * 12; // 12 hours
export const SESSION_REMEMBER_SECONDS = 60 * 60 * 24 * 30; // 30 days ("Remember me")

export type SessionPayload = { userId: string };

// Read lazily so a missing secret never breaks `npm run build`, only real sign-ins.
function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or shorter than 32 characters. See .env.example.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: SessionPayload,
  maxAgeSeconds: number,
): Promise<string> {
  const key = getKey();
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(key);
}

// Returns null for anything wrong: missing, tampered, expired, malformed.
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const key = getKey(); // outside the try, so a missing secret is a loud error
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return typeof payload.userId === "string"
      ? { userId: payload.userId }
      : null;
  } catch {
    return null;
  }
}
