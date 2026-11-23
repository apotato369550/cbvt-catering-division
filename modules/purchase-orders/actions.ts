"use server";

// Server actions for the purchase-orders module. Keep them thin:
//   1. check who is signed in
//   2. call the service inside run()
//   3. revalidatePath("/purchase-orders")
//
// Example shape (added by PO-2):
//
//   export async function createOrder(input: CreateOrderInput) {
//     return run(async () => {
//       await service.createOrder(input);
//       revalidatePath("/purchase-orders");
//     });
//   }
