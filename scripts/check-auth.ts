import "dotenv/config";
import { db } from "../lib/db";
import { authenticate, INVALID_LOGIN_MESSAGE } from "../modules/team";
import { signSessionToken, verifySessionToken } from "../lib/session-token";

let failed = 0;
function check(name: string, pass: boolean) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}`);
  if (!pass) failed++;
}

async function errorMessage(email: string, password: string) {
  try {
    await authenticate(email, password);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

async function main() {
  // --- credentials ---
  const user = await authenticate("juan@cbvtkitchen.ph", "demo1234");
  check("valid login returns the user", user.email === "juan@cbvtkitchen.ph");
  check("returned user has no password hash", !("passwordHash" in user));

  const upper = await authenticate("JUAN@cbvtkitchen.ph", "demo1234");
  check("email is case-insensitive", upper.id === user.id);

  check(
    "wrong password gives the generic message",
    (await errorMessage("juan@cbvtkitchen.ph", "wrong")) ===
      INVALID_LOGIN_MESSAGE,
  );
  check(
    "unknown email gives the same message",
    (await errorMessage("nobody@cbvtkitchen.ph", "demo1234")) ===
      INVALID_LOGIN_MESSAGE,
  );
  check(
    "empty input gives the same message",
    (await errorMessage("", "")) === INVALID_LOGIN_MESSAGE,
  );

  // Temporarily deactivate Ana, then restore her.
  await db.user.update({
    where: { email: "ana@cbvtkitchen.ph" },
    data: { isActive: false },
  });
  try {
    check(
      "inactive account gives the same message",
      (await errorMessage("ana@cbvtkitchen.ph", "demo1234")) ===
        INVALID_LOGIN_MESSAGE,
    );
  } finally {
    await db.user.update({
      where: { email: "ana@cbvtkitchen.ph" },
      data: { isActive: true },
    });
  }

  // --- session token ---
  const token = await signSessionToken({ userId: user.id }, 60);
  check(
    "valid token verifies",
    (await verifySessionToken(token))?.userId === user.id,
  );
  check(
    "tampered token is rejected",
    (await verifySessionToken(token.slice(0, -2) + "xx")) === null,
  );
  check(
    "expired token is rejected",
    (await verifySessionToken(
      await signSessionToken({ userId: user.id }, -10),
    )) === null,
  );
  check(
    "missing token is rejected",
    (await verifySessionToken(undefined)) === null,
  );

  console.log(
    failed === 0 ? "\nAll auth checks passed." : `\n${failed} check(s) failed.`,
  );
  process.exitCode = failed === 0 ? 0 : 1;
}

main()
  .catch((e) => {
    console.error("Auth check crashed:", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
