"use client";

import { useState } from "react";
import Link from "next/link";

export function OverviewNotice({
  notice,
}: {
  notice: {
    title: string;
    description: string;
    href: string;
    linkLabel: string;
  };
}) {
  const [visible, setNotice] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
      <div>
        <p className="text-sm font-semibold">{notice.title}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {notice.description}
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href={notice.href}
          className="text-sm font-semibold text-accent-foreground underline underline-offset-4"
        >
          {notice.linkLabel}
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
