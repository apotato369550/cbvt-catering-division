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

type MaterialItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
};

export default function InventoryClient({
  materials,
}: {
  materials: MaterialItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <KitchenShell
      title="Inventory"
      eyebrow="Raw materials"
      description="Maintain the kitchen material catalog and log daily consumption. This view does not calculate stock balances."
      action={
        <AddButton onClick={() => setOpen(true)}>Log consumption</AddButton>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.4fr]">
        <Panel className="border-accent/30">
          <h3 className="font-serif text-xl font-bold">Input new material</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add ingredients, packaging, or supplies to the catalog.
          </p>
          <div className="mt-5 flex flex-col gap-4">
            <Field label="Material name">
              <input className={inputClass} placeholder="e.g. Coconut milk" />
            </Field>
            <Field label="Category">
              <select className={inputClass}>
                <option>Produce</option>
                <option>Dry goods</option>
                <option>Dairy</option>
                <option>Protein</option>
              </select>
            </Field>
            <Field label="Unit">
              <input className={inputClass} placeholder="kg, cans, bunches" />
            </Field>
            {/* TODO INV-4: save to database */}
            <Button>Add material</Button>
          </div>
        </Panel>

        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Catalog
              </p>
              <h3 className="font-serif text-xl font-bold">Kitchen materials</h3>
            </div>
            {/* TODO INV-7: search */}
            <input
              className={`${inputClass} max-w-44`}
              placeholder="Search materials"
            />
          </div>

          {materials.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No materials yet. Add one to get started.
            </p>
          )}

          {materials.map((item) => (
            <Row key={item.id}>
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.unit} · {item.category}
                </p>
              </div>
              <div className="flex gap-2">
                {/* TODO INV-6: edit */}
                <button className="text-xs font-semibold">Edit</button>
                {/* TODO INV-5: remove */}
                <button className="text-xs font-semibold text-destructive">
                  Remove
                </button>
              </div>
            </Row>
          ))}

          <div className="mt-5 border-t border-border pt-5">
            <h4 className="text-sm font-bold">Consumption log</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Log what was used during service without changing the catalog.
            </p>
            <Button onClick={() => setOpen(true)}>Log consumption</Button>
          </div>
          <PageNote>
            Removal prompts a warning before the placeholder record disappears.
          </PageNote>
        </Panel>
      </div>

      {open && (
        <Modal title="Log inventory consumption" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Material">
              <select className={inputClass}>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quantity used">
              <input className={inputClass} type="number" placeholder="0" />
            </Field>
            <Field label="Note">
              <textarea
                className={`${inputClass} min-h-24`}
                placeholder="Service or prep note"
              />
            </Field>
            {/* TODO INV-8: save consumption */}
            <Button onClick={() => setOpen(false)}>Save consumption</Button>
          </div>
        </Modal>
      )}
    </KitchenShell>
  );
}