import { db } from "./lib/db";

async function main() {
  console.log("Materials in DB:", await db.material.count());
}

main().finally(() => db.$disconnect());