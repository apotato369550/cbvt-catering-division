"use client";

import { useState } from "react";

import { KitchenShell, AddButton } from "@/components/kitchen-shell";

import { ProductionForm } from "@/components/production/production-form";
import { ProductionHistory } from "@/components/production/production-history";
import { ProductionModal } from "@/components/production/production-modal";
import type { ProductionBatchItem } from "@/modules/production/types";

export default function ProductionClient({
  batches,
}: {
  batches: ProductionBatchItem[];
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
  }

  return (
    <KitchenShell
      title="Production log"
      eyebrow="Kitchen workflow"
      description="Record what the team produces each day. Entries are append-only so the kitchen history stays clear."
      action={
        <AddButton onClick={() => setOpen(true)}>Log production</AddButton>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.4fr]">
        <ProductionForm onSave={handleSave} saved={saved} />

        <ProductionHistory batches={batches} />
      </div>

      <ProductionModal open={open} onClose={() => setOpen(false)} />
    </KitchenShell>
  );
}
