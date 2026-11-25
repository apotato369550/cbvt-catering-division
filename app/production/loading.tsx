import { KitchenShell, Panel } from "@/components/kitchen-shell";

// Shown by Next.js while page.tsx is reading the database.
export default function Loading() {
  return (
    <KitchenShell
      title="Production log"
      eyebrow="Kitchen workflow"
      description="Loading today's production..."
    >
      <Panel>
        <div className="flex animate-pulse flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-muted" />
          ))}
        </div>
      </Panel>
    </KitchenShell>
  );
}
