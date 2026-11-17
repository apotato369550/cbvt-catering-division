import { db } from "../lib/db";

async function main() {
  const count = await db.material.count();
  console.log(`Database OK. Materials in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error("Database check failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());