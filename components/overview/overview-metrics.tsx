type MetricProps = {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
  warning?: boolean;
};

function Metric({ label, value, detail, positive, warning }: MetricProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-4 font-serif text-4xl font-bold">{value}</p>

      <p
        className={`mt-2 text-xs font-medium ${
          warning || positive
            ? "text-accent-foreground"
            : "text-muted-foreground"
        }`}
      >
        {positive ? "↑ " : warning ? "!" : ""}
        {detail}
      </p>
    </div>
  );
}

export function OverviewMetrics({ metrics }: { metrics: MetricProps[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Metric key={metric.label} {...metric} />
      ))}
    </section>
  );
}
