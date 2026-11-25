import { KitchenShell, Panel } from "@/components/kitchen-shell";

// Shown by Next.js while page.tsx is reading the database.
export default function Loading() {
  return (
    <KitchenShell
      title="Inventory"
      eyebrow="Raw materials"
      description="Loading materials..."
    >
      <Panel>
        <div className="flex animate-pulse flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-muted" />
          ))}
        </div>
      </Panel>
    </KitchenShell>
  );
}
