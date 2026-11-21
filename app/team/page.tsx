
"use client";

import { useState } from "react";

import {
  KitchenShell,
  AddButton,
} from "@/components/kitchen-shell";

import {
  initialMembers,
  type TeamMember,
} from "@/components/team/data";

import { MemberList } from "@/components/team/member-list";
import { TeamSettings } from "@/components/team/team-settings";
import { MemberModal } from "@/components/team/member-modal";

export default function Team() {
  const [open, setOpen] = useState(false);

  const [members, setMembers] = useState<TeamMember[]>(
    initialMembers
  );

  function handleSaveMember() {
    setMembers((previousMembers) => [
      ...previousMembers,
      {
        initials: "NW",
        name: "New team member",
        role: "Kitchen staff",
      },
    ]);

    setOpen(false);
  }

  return (
    <KitchenShell
      title="Team & settings"
      eyebrow="Workspace access"
      description="Manage members and kitchen permissions. Admins can add, edit, deactivate, and remove staff."
      action={
        <AddButton onClick={() => setOpen(true)}>
          Add team member
        </AddButton>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_.8fr]">
        <MemberList
          members={members}
          onEdit={() => setOpen(true)}
        />

        <TeamSettings
          onSave={() => setOpen(true)}
        />
      </div>

      <MemberModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveMember}
      />
    </KitchenShell>
  );
}
