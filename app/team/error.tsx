"use client";

import { Button, KitchenShell, Panel } from "@/components/kitchen-shell";

export default function TeamError({ retry }: { retry: () => void }) {
  return (
    <KitchenShell
      title="Team & settings"
      eyebrow="Workspace access"
      description="Manage members and kitchen permissions."
    >
      <Panel>
        <p role="alert">Could not load workspace settings.</p>
        <div className="mt-4">
          <Button onClick={retry}>Try again</Button>
        </div>
      </Panel>
    </KitchenShell>
  );
}
