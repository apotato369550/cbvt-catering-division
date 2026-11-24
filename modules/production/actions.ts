"use server";

// Server actions for the production module. Keep them thin:
//   1. check who is signed in
//   2. call the service inside run()
//   3. revalidatePath("/production")
//
// Example shape (added by PROD-2):
//
//   export async function logProduction(input: LogProductionInput) {
//     return run(async () => {
//       await service.logProduction(input);
//       revalidatePath("/production");
//     });
//   }
