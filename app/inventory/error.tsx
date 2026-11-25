"use client";

import { useEffect } from "react";
import { Button, KitchenShell, Panel } from "@/components/kitchen-shell";

// Shown by Next.js when page.tsx throws (for example the database is unreachable).
export default function InventoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <KitchenShell
      title="Inventory"
      eyebrow="Raw materials"
      description="Maintain the kitchen material catalog and log daily consumption."
    >
      <Panel>
        <h3 className="font-serif text-xl font-bold">
          We couldn’t load the inventory.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while reading the database. Try again, and tell
          the team if it keeps happening.
        </p>
        <div className="mt-5">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Panel>
    </KitchenShell>
  );
}
