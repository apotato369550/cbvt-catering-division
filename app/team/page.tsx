import { getSettings } from "@/modules/team";
import TeamClient from "./team-client";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const settings = await getSettings();
  return <TeamClient settings={settings} />;
}
