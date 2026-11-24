"use client";

import { useState } from "react";

import { Panel, Status, Row, inputClass } from "@/components/kitchen-shell";

import type { PurchaseOrder } from "./data";

type OrderHistoryProps = {
  orders: PurchaseOrder[];
  onUpdate: () => void;
};

export function OrderHistory({ orders, onUpdate }: OrderHistoryProps) {
  const [filter, setFilter] = useState("All statuses");

  const filteredOrders =
    filter === "All statuses"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Active orders
          </p>

          <h3 className="font-serif text-xl font-bold">
            Purchase order tracking
          </h3>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`${inputClass} max-w-40`}
        >
          <option>All statuses</option>
          <option>Awaiting</option>
          <option>Confirmed</option>
          <option>In transit</option>
          <option>Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No purchase orders found.
        </p>
      ) : (
        filteredOrders.map((order) => (
          <Row key={order.id}>
            <div>
              <p className="font-mono text-xs font-semibold">{order.id}</p>

              <p className="mt-1 text-sm font-semibold">{order.vendor}</p>

              <p className="text-xs text-muted-foreground">
                Arrival: {order.arrival}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Status>{order.status}</Status>

              <button onClick={onUpdate} className="text-xs font-semibold">
                Update
              </button>

              <button type="button" className="text-xs text-destructive">
                Delete
              </button>
            </div>
          </Row>
        ))
      )}
    </Panel>
  );
}
