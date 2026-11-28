"use server";

import { run } from "@/lib/result";
import { updateSettings } from "./service";
import type { WorkspaceSettings } from "./types";

export async function saveSettings(input: WorkspaceSettings) {
  return run(() => updateSettings(input));
}

// Server actions for the team module. Keep them thin:
//   1. check who is signed in
//   2. call the service inside run()
//   3. revalidatePath("/team")
//
// Example shape (added by TEAM-2):
//
//   export async function addMember(input: AddMemberInput) {
//     return run(async () => {
//       await service.addMember(input);
//       revalidatePath("/team");
//     });
//   }
