
import Link from "next/link";
import { prepSchedule } from "./data";

export function PrepSchedule() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Up next
          </p>

          <h3 className="mt-1 font-serif text-xl font-bold">
            Prep schedule
          </h3>
        </div>

        <Link
          href="/production"
          className="text-sm font-semibold text-accent-foreground"
        >
          See all ↗
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {prepSchedule.map((item, i) => (
          <div key={item.title} className="flex gap-4">
            <span className="w-12 pt-1 text-xs font-semibold text-muted-foreground">
              {item.time}
            </span>

            <div className="relative flex-1 border-l border-border pl-4">
              <p className="text-sm font-semibold">
                {item.title}
              </p>

              <p
                className={`mt-1 text-xs ${
                  i === 0
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
