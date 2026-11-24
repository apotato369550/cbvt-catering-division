import {
  Panel,
  Field,
  Button,
  PageNote,
  inputClass,
} from "@/components/kitchen-shell";

type OrderFormProps = {
  onGenerate: () => void;
};

export function OrderForm({ onGenerate }: OrderFormProps) {
  return (
    <Panel className="border-accent/30">
      <h3 className="font-serif text-xl font-bold">Create purchase order</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Field label="Customer / vendor">
          <input className={inputClass} placeholder="Fresh Fields Supply" />
        </Field>

        <Field label="Product">
          <input className={inputClass} placeholder="Produce item" />
        </Field>

        <Field label="Quantity">
          <input className={inputClass} type="number" placeholder="1" />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="text-sm font-semibold text-accent-foreground"
        >
          + Add product line
        </button>

        <Button onClick={onGenerate}>Generate PO number</Button>
      </div>

      <PageNote>
        Order number and totals are placeholders; status is manually updated.
      </PageNote>
    </Panel>
  );
}
