import { listOrders } from "@/modules/purchase-orders";
import PurchaseOrdersClient from "./purchase-orders-client";

// Always read fresh orders instead of caching the page at build time.
export const dynamic = "force-dynamic";

export default async function PurchaseOrdersPage() {
  const orders = await listOrders();
  return <PurchaseOrdersClient orders={orders} />;
}
