import { listTodaysBatches } from "@/modules/production";
import ProductionClient from "./production-client";

// Always read fresh data instead of caching the page at build time.
export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  // Voided batches are already left out, newest first.
  const batches = await listTodaysBatches();
  return <ProductionClient batches={batches} />;
}
