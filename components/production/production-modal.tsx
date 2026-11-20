
import {
  Modal,
  Field,
  Button,
  inputClass,
} from "@/components/kitchen-shell";

type ProductionModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ProductionModal({
  open,
  onClose,
}: ProductionModalProps) {
  if (!open) return null;

  return (
    <Modal
      title="Log production batch"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Field label="Batch name">
          <input
            className={inputClass}
            placeholder="Product or prep batch"
          />
        </Field>

        <Field label="Portions">
          <input
            className={inputClass}
            type="number"
            placeholder="0"
          />
        </Field>

        <Button onClick={onClose}>
          Save batch
        </Button>
      </div>
    </Modal>
  );
}
