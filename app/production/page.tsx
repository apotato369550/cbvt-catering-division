"use client";
import { useState } from "react";
import {
  KitchenShell,
  Panel,
  Field,
  Button,
  Status,
  Row,
  AddButton,
  Modal,
  inputClass,
  PageNote,
} from "@/components/kitchen-shell";
export default function Production() {
  const [rows, setRows] = useState([
    "Sauce base · 24 portions",
    "Vegetable prep · 18 portions",
    "Dinner mise en place · 42 portions",
  ]);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
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
        <Panel className="border-accent/30">
          <h3 className="font-serif text-xl font-bold">Rapid entry</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Capture one batch at a time, then add another without leaving the
            workflow.
          </p>
          <div className="mt-5 flex flex-col gap-4">
            <Field label="Production date">
              <input
                type="date"
                defaultValue="2026-09-02"
                className={inputClass}
              />
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
            <Button
              onClick={() => {
                setSaved(true);
                setRows([...rows, "New batch · just now"]);
              }}
            >
              Save production
            </Button>
            {saved && (
              <p className="rounded-lg bg-accent/15 px-4 py-3 text-sm font-semibold text-accent-foreground">
                Production record added to this session.
              </p>
            )}
          </div>
        </Panel>
        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                History
              </p>
              <h3 className="font-serif text-xl font-bold">
                Today&apos;s production
              </h3>
            </div>
            <Status>{rows.length} records</Status>
          </div>
          {rows.map((r, i) => (
            <Row key={`${r}-${i}`}>
              <div>
                <p className="text-sm font-semibold">{r}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Recorded by Juan · Sep 02, 2026
                </p>
              </div>
              <Status>{i === 0 ? "In progress" : "Recorded"}</Status>
            </Row>
          ))}
          <PageNote>
            Records can be deleted from the confirmation menu in the full
            product.
          </PageNote>
        </Panel>
      </div>
      {open && (
        <Modal title="Log production batch" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Batch name">
              <input
                className={inputClass}
                placeholder="Product or prep batch"
              />
            </Field>
            <Field label="Portions">
              <input className={inputClass} type="number" placeholder="0" />
            </Field>
            <Button onClick={() => setOpen(false)}>Save batch</Button>
          </div>
        </Modal>
      )}
    </KitchenShell>
  );
}
