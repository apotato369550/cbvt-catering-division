
import {
  Panel,
  Field,
  Button,
  inputClass,
} from "@/components/kitchen-shell";

type TeamSettingsProps = {
  onSave: () => void;
};

export function TeamSettings({
  onSave,
}: TeamSettingsProps) {
  return (
    <Panel>
      <h3 className="font-serif text-xl font-bold">
        Settings
      </h3>

      <div className="mt-5 flex flex-col gap-5">
        <Field label="Workspace name">
          <input
            className={inputClass}
            defaultValue="CBVT Kitchen"
          />
        </Field>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>
            <strong>Daily prep reminders</strong>

            <small className="mt-1 block text-xs text-muted-foreground">
              Notify the team about upcoming prep.
            </small>
          </span>

          <input
            type="checkbox"
            defaultChecked
            className="accent-accent"
          />
        </label>

        <label className="flex items-center justify-between gap-4 text-sm">
          <span>
            <strong>Require admin approval</strong>

            <small className="mt-1 block text-xs text-muted-foreground">
              For new purchase orders.
            </small>
          </span>

          <input
            type="checkbox"
            className="accent-accent"
          />
        </label>

        <Button onClick={onSave}>
          Save settings
        </Button>
      </div>
    </Panel>
  );
}
