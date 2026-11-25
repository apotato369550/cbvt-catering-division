"use client";

import { useState } from "react";
import { ActivityModal } from "./overview-activity-modal";

export function OverviewActivity() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-95"
      >
        + Log activity
      </button>
      <ActivityModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
