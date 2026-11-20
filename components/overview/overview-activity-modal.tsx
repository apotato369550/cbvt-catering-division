
type ActivityModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ActivityModal({
  open,
  onClose,
}: ActivityModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-primary/40 p-6">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Quick entry
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold">
              Log kitchen activity
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl text-muted-foreground"
          >
            ×
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-medium">
            Activity type

            <select className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3">
              <option>Production batch</option>
              <option>Waste record</option>
              <option>Stock count</option>
            </select>
          </label>

          <label className="text-sm font-medium">
            Notes

            <textarea
              className="mt-2 min-h-24 w-full rounded-lg border border-border bg-card px-3 py-3"
              placeholder="Add a short note..."
            />
          </label>

          <button
            onClick={onClose}
            className="rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground"
          >
            Save activity
          </button>
        </div>
      </div>
    </div>
  );
}
