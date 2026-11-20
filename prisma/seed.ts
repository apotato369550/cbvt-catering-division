import { db } from "../lib/db";

async function main() {
  if ((await db.material.count()) > 0) {
    console.log("Materials already exist, skipping seed.");
    return;
  }

  await db.material.createMany({
    data: [
      { name: "Coconut milk", category: "Produce", unit: "cans" },
      { name: "Jasmine rice", category: "Dry goods", unit: "kg" },
      { name: "Fresh basil", category: "Produce", unit: "bunches" },
      { name: "Chicken thighs", category: "Protein", unit: "kg" },
      { name: "Men", category: "Protein", unit: "kg" },
    ],
  });
  console.log("Seeded 4 materials.");
}

main().finally(() => db.$disconnect());