"use client";

import { Panel, Field, Button, inputClass } from "@/components/kitchen-shell";

type ProductionFormProps = {
  onSave: () => void;
  saved: boolean;
};

export function ProductionForm({ onSave, saved }: ProductionFormProps) {
  return (
    <Panel className="border-accent/30">
      <h3 className="font-serif text-xl font-bold">Rapid entry</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Capture one batch at a time, then add another without leaving the
        workflow.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <Field label="Production date">
          <input type="date" defaultValue="2026-09-02" className={inputClass} />
        </Field>

        <Field label="Product / batch">
          <input className={inputClass} placeholder="e.g. Sauce base" />
        </Field>

        <Field label="Quantity">
          <input type="number" className={inputClass} placeholder="24" />
        </Field>

        <Field label="Notes">
          <textarea
            className={`${inputClass} min-h-24`}
            placeholder="Optional preparation note"
          />
        </Field>

        <Button onClick={onSave}>Save production</Button>

        {saved && (
          <p className="rounded-lg bg-accent/15 px-4 py-3 text-sm font-semibold text-accent-foreground">
            Production record added to this session.
          </p>
        )}
      </div>
    </Panel>
  );
}
