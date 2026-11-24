import { Modal, Field, Button, inputClass } from "@/components/kitchen-shell";

type MemberModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export function MemberModal({ open, onClose, onSave }: MemberModalProps) {
  if (!open) return null;

  return (
    <Modal title="Add or edit team member" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Name">
          <input className={inputClass} placeholder="Full name" />
        </Field>

        <Field label="Email">
          <input className={inputClass} placeholder="name@cbvtkitchen.ph" />
        </Field>

        <Field label="Role">
          <select className={inputClass}>
            <option>Kitchen staff</option>
            <option>Management</option>
            <option>Viewer</option>
            <option>Admin</option>
          </select>
        </Field>

        <Button onClick={onSave}>Save member</Button>
      </div>
    </Modal>
  );
}
