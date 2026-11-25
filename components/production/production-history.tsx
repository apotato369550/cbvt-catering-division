"use client";

import { Panel, Row, Status } from "@/components/kitchen-shell";
import type { ProductionBatchItem } from "@/modules/production";
// Client components import VALUES from types.ts, never from the module's index.ts.
// (index.ts pulls in the database code, which must stay on the server.)
import { BATCH_STATUS_LABELS } from "@/modules/production/types";
import { formatRecorded } from "./format";

function portionsText(batch: ProductionBatchItem) {
  if (batch.status !== "QUEUED") return `${batch.portions} portions`;
  return batch.targetPortions !== null
    ? `target ${batch.targetPortions} portions`
    : "not started";
}

export function ProductionHistory({
  batches,
}: {
  batches: ProductionBatchItem[];
}) {
  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            History
          </p>
          <h3 className="font-serif text-xl font-bold">
            Today&apos;s production
          </h3>
        </div>
        <Status>
          {batches.length} {batches.length === 1 ? "record" : "records"}
        </Status>
      </div>

      {batches.length === 0 && (
        <p className="py-6 text-sm text-muted-foreground">
          No production recorded today yet.
        </p>
      )}

      {batches.map((b) => (
        <Row key={b.id}>
          <div>
            <p className="text-sm font-semibold">
              {b.name} · {portionsText(b)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Recorded by {b.recordedBy} · {formatRecorded(b.createdAt)}
            </p>
          </div>
          <Status>{BATCH_STATUS_LABELS[b.status]}</Status>
        </Row>
      ))}
    </Panel>
  );
}
