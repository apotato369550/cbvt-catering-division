"use client";

import { PageNote, Panel, Status } from "@/components/kitchen-shell";
import type { UserItem } from "@/modules/team";
// Client components import VALUES from types.ts, never from the module's index.ts.
// (index.ts pulls in the database code, which must stay on the server.)
import { ROLE_LABELS } from "@/modules/team/types";
import { initials } from "./format";

export function MemberList({
  members,
  onEdit,
}: {
  members: UserItem[];
  // Optional until TEAM-3 turns "Edit" into a real edit.
  onEdit?: (member: UserItem) => void;
}) {
  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            People
          </p>
          <h3 className="font-serif text-xl font-bold">Kitchen team</h3>
        </div>
        {/* TODO LOG-4: show the signed-in user's real role */}
        <Status>Current role: Admin</Status>
      </div>

      {members.length === 0 && (
        <p className="py-6 text-sm text-muted-foreground">
          No team members yet.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {members.map((m) => (
          <div
            key={m.id}
            className={`flex items-center gap-4 rounded-xl border border-border p-4 ${
              m.isActive ? "" : "opacity-60"
            }`}
          >
            <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials(m.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-muted-foreground">
                {ROLE_LABELS[m.role]}
              </p>
            </div>
            <Status>{m.isActive ? "Active" : "Inactive"}</Status>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(m)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold"
                >
                  Edit
                </button>
              )}
              {/* TODO TEAM-4: deactivate / reactivate */}
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

export default MemberList;
