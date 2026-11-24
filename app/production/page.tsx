"use client";

import { useState } from "react";

import { KitchenShell, AddButton } from "@/components/kitchen-shell";

import { initialProductionRows } from "@/components/production/data";

import { ProductionForm } from "@/components/production/production-form";
import { ProductionHistory } from "@/components/production/production-history";
import { ProductionModal } from "@/components/production/production-modal";

export default function Production() {
  const [rows, setRows] = useState(initialProductionRows);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setRows((previousRows) => [...previousRows, "New batch · just now"]);
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

        <ProductionHistory rows={rows} />
      </div>

      <ProductionModal open={open} onClose={() => setOpen(false)} />
    </KitchenShell>
  );
}
