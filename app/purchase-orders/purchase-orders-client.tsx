"use client";

import { useState } from "react";

import { KitchenShell, AddButton } from "@/components/kitchen-shell";

import { OrderForm } from "@/components/purchase-orders/order-form";
import { OrderHistory } from "@/components/purchase-orders/order-history";
import { OrderModal } from "@/components/purchase-orders/order-modal";
import type { PurchaseOrderItem } from "@/modules/purchase-orders";

export default function PurchaseOrdersClient({
  orders,
}: {
  orders: PurchaseOrderItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <KitchenShell
      title="Purchase orders"
      eyebrow="Supply chain"
      description="Create customer-facing orders, add repeatable product lines, and keep delivery status visible to the team."
      action={
        <AddButton onClick={() => setOpen(true)}>New purchase order</AddButton>
      }
    >
      <div className="flex flex-col gap-6">
        <OrderForm onGenerate={() => setOpen(true)} />

        <OrderHistory orders={orders} onUpdate={() => setOpen(true)} />
      </div>

      <OrderModal open={open} onClose={() => setOpen(false)} />
    </KitchenShell>
  );
}
