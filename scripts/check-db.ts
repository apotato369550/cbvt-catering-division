import { db } from "../lib/db";
import { listMaterials } from "../modules/inventory";
import { listUsers } from "../modules/team";
import { listTodaysBatches } from "../modules/production";
import { listOrders } from "../modules/purchase-orders";

async function main() {
  const [users, materials, batches, orders] = await Promise.all([
    listUsers(),
    listMaterials(),
    listTodaysBatches(),
    listOrders(),
  ]);

  console.log("Database OK.");
  console.log(`Users: ${users.length}`);
  console.log(
    `Materials: ${materials.length} (low stock: ${materials.filter((m) => m.isLow).length})`,
  );
  console.log(`Today's production batches: ${batches.length}`);
  console.log(`Purchase orders: ${orders.length}`);
}

main()
  .catch((e) => {
    console.error("Database check failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
