import bcrypt from "bcryptjs";
import { db } from "../lib/db";

// DEV ONLY. Every seeded account uses this password.
const DEMO_PASSWORD = "demo1234";

// Dates are relative to "now" so "Today" and "Tomorrow" in the UI always make sense.
function at(daysFromNow: number, hour = 0, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  if ((await db.user.count()) > 0) {
    console.log("Already seeded. Run `npx prisma migrate reset` to start over.");
    return;
  }

  // ---------- team ----------
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const juan = await db.user.create({
    data: { name: "Juan Dela Cruz", email: "juan@cbvtkitchen.ph", passwordHash, role: "ADMIN" },
  });
  const ana = await db.user.create({
    data: { name: "Ana Mercado", email: "ana@cbvtkitchen.ph", passwordHash, role: "KITCHEN_STAFF" },
  });
  await db.user.create({
    data: { name: "Rico Santos", email: "rico@cbvtkitchen.ph", passwordHash, role: "MANAGEMENT" },
  });

  await db.workspaceSetting.create({ data: { id: "default" } });

  // ---------- inventory ----------
  // `balance` is the stock we want to end up with after all movements below.
  const materialDefs = [
    { name: "Coconut milk", category: "Produce", unit: "cans", reorderLevel: 6, balance: 4 },
    { name: "Jasmine rice", category: "Dry goods", unit: "kg", reorderLevel: 10, balance: 12 },
    { name: "Fresh basil", category: "Produce", unit: "bunches", reorderLevel: 3, balance: 2 },
    { name: "Chicken thighs", category: "Protein", unit: "kg", reorderLevel: 10, balance: 8 },
    { name: "Garlic", category: "Produce", unit: "kg", reorderLevel: 2, balance: 5 },
    { name: "Cooking oil", category: "Dry goods", unit: "liters", reorderLevel: 4, balance: 10 },
    { name: "Fresh milk", category: "Dairy", unit: "liters", reorderLevel: 8, balance: 15 },
    { name: "Butter", category: "Dairy", unit: "kg", reorderLevel: 2, balance: 6 },
  ];

  // Usage that already happened (used for consumption history and the waste rate).
  const usage = [
    { material: "Coconut milk", type: "CONSUMPTION", qty: 8, daysAgo: 3, note: "Sauce base" },
    { material: "Jasmine rice", type: "CONSUMPTION", qty: 6, daysAgo: 2, note: "Lunch service" },
    { material: "Fresh basil", type: "CONSUMPTION", qty: 3, daysAgo: 2, note: "Vegetable prep" },
    { material: "Chicken thighs", type: "CONSUMPTION", qty: 12, daysAgo: 1, note: "Dinner mise en place" },
    { material: "Cooking oil", type: "CONSUMPTION", qty: 2, daysAgo: 1, note: "Frying station" },
    { material: "Fresh basil", type: "WASTE", qty: 1, daysAgo: 1, note: "Wilted" },
    { material: "Chicken thighs", type: "WASTE", qty: 0.5, daysAgo: 1, note: "Trimmings" },
    { material: "Fresh milk", type: "WASTE", qty: 1, daysAgo: 2, note: "Expired" },
  ];

  const materialIds = new Map<string, string>();
  for (const def of materialDefs) {
    const material = await db.material.create({
      data: {
        name: def.name,
        category: def.category,
        unit: def.unit,
        reorderLevel: def.reorderLevel,
      },
    });
    materialIds.set(def.name, material.id);

    // One opening receipt big enough that balance - after usage - equals def.balance.
    const used = usage
      .filter((u) => u.material === def.name)
      .reduce((sum, u) => sum + u.qty, 0);

    await db.stockMovement.create({
      data: {
        materialId: material.id,
        type: "RECEIPT",
        quantity: def.balance + used,
        note: "Opening stock",
        occurredAt: at(-7, 8),
        createdById: juan.id,
      },
    });
  }

  for (const u of usage) {
    await db.stockMovement.create({
      data: {
        materialId: materialIds.get(u.material)!,
        type: u.type,
        quantity: -u.qty, // consumption and waste remove stock
        note: u.note,
        occurredAt: at(-u.daysAgo, 15),
        createdById: ana.id,
      },
    });
  }

  // ---------- purchase orders ----------
  const freshFields = await db.supplier.create({ data: { name: "Fresh Fields Supply" } });
  const cebuGrain = await db.supplier.create({ data: { name: "Cebu Grain Co." } });
  const islandDairy = await db.supplier.create({ data: { name: "Island Dairy" } });

  const orders = [
    {
      poNumber: "PO-2048",
      supplierId: freshFields.id,
      status: "IN_TRANSIT",
      expectedAt: at(0, 14),
      lines: [
        { material: "Fresh basil", quantity: 10 },
        { material: "Garlic", quantity: 5 },
        { material: "Coconut milk", quantity: 24 },
      ],
    },
    {
      poNumber: "PO-2047",
      supplierId: cebuGrain.id,
      status: "CONFIRMED",
      expectedAt: at(1, 9),
      lines: [
        { material: "Jasmine rice", quantity: 25 },
        { material: "Cooking oil", quantity: 10 },
      ],
    },
    {
      poNumber: "PO-2046",
      supplierId: islandDairy.id,
      status: "AWAITING",
      expectedAt: at(4, 9),
      lines: [
        { material: "Fresh milk", quantity: 20 },
        { material: "Butter", quantity: 5 },
      ],
    },
  ];

  for (const o of orders) {
    await db.purchaseOrder.create({
      data: {
        poNumber: o.poNumber,
        supplierId: o.supplierId,
        status: o.status,
        expectedAt: o.expectedAt,
        createdById: juan.id,
        lines: {
          create: o.lines.map((l) => ({
            materialId: materialIds.get(l.material)!,
            quantity: l.quantity,
          })),
        },
      },
    });
  }

  // ---------- production ----------
  // Today's schedule (matches the Overview "Prep schedule").
  const today = at(0);
  const todaysBatches = [
    { name: "Sauce base", status: "IN_PROGRESS", hour: 10, minute: 0, target: 24, portions: 24 },
    { name: "Vegetable prep", status: "QUEUED", hour: 11, minute: 30, target: 18, portions: 0 },
    { name: "Dinner mise en place", status: "QUEUED", hour: 14, minute: 0, target: 42, portions: 0 },
    { name: "Final plating check", status: "QUEUED", hour: 16, minute: 30, target: null, portions: 0 },
  ];

  for (const b of todaysBatches) {
    await db.productionBatch.create({
      data: {
        name: b.name,
        productionDate: today,
        scheduledAt: at(0, b.hour, b.minute),
        targetPortions: b.target,
        portions: b.portions,
        status: b.status,
        createdById: ana.id,
      },
    });
  }

  // Previous six days. Every third day one batch was never finished,
  // so the weekly "prep completion" chart has some variety.
  for (let d = 1; d <= 6; d++) {
    const dayBatches = [
      { name: "Sauce base", hour: 10, portions: 24, status: "RECORDED" },
      { name: "Vegetable prep", hour: 11, portions: 18, status: "RECORDED" },
      {
        name: "Dinner mise en place",
        hour: 14,
        portions: d % 3 === 0 ? 0 : 42,
        status: d % 3 === 0 ? "QUEUED" : "RECORDED",
      },
    ];

    for (const b of dayBatches) {
      await db.productionBatch.create({
        data: {
          name: b.name,
          productionDate: at(-d),
          scheduledAt: at(-d, b.hour),
          targetPortions: b.status === "RECORDED" ? b.portions : 42,
          portions: b.portions,
          status: b.status,
          createdById: ana.id,
        },
      });
    }
  }

  console.log("Seeded: 3 users, 8 materials, 3 suppliers, 3 purchase orders, production history.");
  console.log(`All demo accounts use the password: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());