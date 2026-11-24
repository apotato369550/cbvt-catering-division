"use server";

// Server actions for the inventory module. Keep them thin:
//   1. check who is signed in
//   2. call the service inside run()
//   3. revalidatePath("/inventory")
//
// Example shape (added by INV-12):
//
//   export async function addMaterial(input: AddMaterialInput) {
//     return run(async () => {
//       await service.addMaterial(input);
//       revalidatePath("/inventory");
//     });
//   }
