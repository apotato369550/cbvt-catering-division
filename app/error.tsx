"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <section className="space-y-3 p-6">
      <p role="alert">Could not load the dashboard.</p>
      <button className="rounded-lg border px-3 py-2" onClick={retry}>
        Try again
      </button>
    </section>
  );
}
