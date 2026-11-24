// Shared by every module.
// Services throw DomainError when a business rule is broken ("Name already exists").
// Actions wrap their work in run(), which turns that into a result the UI can show.

export type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string };

export class DomainError extends Error {}

export function ok<T = undefined>(data?: T): ActionResult<T> {
  return { ok: true, data: data as T };
}

export function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

export async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return ok(await fn());
  } catch (e) {
    if (e instanceof DomainError) return fail(e.message);
    console.error(e);
    return fail("Something went wrong. Please try again.");
  }
}
