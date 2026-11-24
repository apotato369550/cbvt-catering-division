import { Panel, Status, Row, PageNote } from "@/components/kitchen-shell";

type ProductionHistoryProps = {
  rows: string[];
};

export function ProductionHistory({ rows }: ProductionHistoryProps) {
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

        <Status>{rows.length} records</Status>
      </div>

      {rows.map((record, i) => (
        <Row key={`${record}-${i}`}>
          <div>
            <p className="text-sm font-semibold">{record}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded by Juan · Sep 02, 2026
            </p>
          </div>

          <Status>{i === 0 ? "In progress" : "Recorded"}</Status>
        </Row>
      ))}

      <PageNote>
        Records can be deleted from the confirmation menu in the full product.
      </PageNote>
    </Panel>
  );
}
