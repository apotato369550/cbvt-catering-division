
"use client";

import { useState } from "react";
import Link from "next/link";

export function OverviewNotice() {
  const [notice, setNotice] = useState(true);

  if (!notice) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
      <div>
        <p className="text-sm font-semibold">
          3 ingredients need attention
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Check low stock before tomorrow&apos;s prep schedule.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/inventory"
          className="text-sm font-semibold text-accent-foreground underline underline-offset-4"
        >
          Review inventory
        </Link>

        <button
          onClick={() => setNotice(false)}
          className="text-muted-foreground"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
