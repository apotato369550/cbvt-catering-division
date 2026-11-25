import { listUsers } from "@/modules/team";
import TeamClient from "./team-client";

// Always read fresh data instead of caching the page at build time.
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  // Never includes password hashes. The module only selects safe fields.
  const members = await listUsers();
  return <TeamClient members={members} />;
}
