import { db } from "../lib/db";
import { listMaterials } from "../modules/inventory";
import { listUsers, getUserById } from "../modules/team"; // 1. add getUserById here
import { listTodaysBatches } from "../modules/production";
import { listOrders } from "../modules/purchase-orders";

async function main() {
  const [users, materials, batches, orders] = await Promise.all([
    listUsers(),
    listMaterials(),
    listTodaysBatches(),
    listOrders(),
  ]);

  // 2. paste the snippet here, right after `users` is loaded
  const first = users[0];
  const found = await getUserById(first.id);
  const missing = await getUserById("does-not-exist");
  if (found?.name !== first.name || missing !== null) {
    throw new Error("getUserById check failed");
  }
  console.log("getUserById: OK");

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
