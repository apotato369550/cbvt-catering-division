import { KitchenShell, Panel } from "@/components/kitchen-shell";

export default function Loading() {
  return (
    <KitchenShell
      title="Team & settings"
      eyebrow="Workspace access"
      description="Loading workspace settings…"
    >
      <Panel>
        <p role="status">Loading workspace settings…</p>
      </Panel>
    </KitchenShell>
  );
}
