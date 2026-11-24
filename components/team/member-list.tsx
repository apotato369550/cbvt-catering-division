import { Panel, Status, PageNote } from "@/components/kitchen-shell";

import type { TeamMember } from "./data";

type MemberListProps = {
  members: TeamMember[];
  onEdit: () => void;
};

export function MemberList({ members, onEdit }: MemberListProps) {
  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            People
          </p>

          <h3 className="font-serif text-xl font-bold">Kitchen team</h3>
        </div>

        <Status>Current role: Admin</Status>
      </div>

      <div className="flex flex-col gap-3">
        {members.map((member, index) => (
          <div
            key={`${member.initials}-${index}`}
            className="flex items-center gap-4 rounded-xl border border-border p-4"
          >
            <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {member.initials}
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">{member.name}</p>

              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold"
              >
                Edit
              </button>

              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-destructive"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <PageNote>
        Remove and deactivate actions show confirmation in the full product.
      </PageNote>
    </Panel>
  );
}
