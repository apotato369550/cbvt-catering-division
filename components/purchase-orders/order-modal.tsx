import { Modal, Field, Button, inputClass } from "@/components/kitchen-shell";

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
};

export function OrderModal({ open, onClose }: OrderModalProps) {
  if (!open) return null;

  return (
    <Modal title="New purchase order" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Customer">
          <input className={inputClass} placeholder="Customer or vendor" />
        </Field>

        <Field label="Products">
          <textarea
            className={`${inputClass} min-h-24`}
            placeholder="Product — quantity, one per line"
          />
        </Field>

        <Field label="Status">
          <select className={inputClass}>
            <option>Awaiting</option>
            <option>Confirmed</option>
            <option>In transit</option>
          </select>
        </Field>

        <Button onClick={onClose}>Save order</Button>
      </div>
    </Modal>
  );
}
