# Business Processes — Cebu Best Value Trading Kitchen Management System

This document describes **what the business does and how it operates**, independent of any programming language, framework, or database. It is meant to be read by a human or an AI agent designing a v2 system from scratch, without needing to reverse-engineer the current (v1) codebase.

It captures the *intended* business process — how the operation is meant to run — not the quirks of any particular implementation.

---

## 1. Overview

Cebu Best Value Trading is a food production and sales business. The system supports two related but deliberately independent sides of the operation:

1. **Kitchen tracking** — recording what raw materials (ingredients, packaging) are used, and what finished products are produced, on a day-to-day basis.
2. **Sales & fulfillment tracking** — recording customer orders, and tracking their delivery over time until complete.

**Core design principle:** kitchen tracking and sales tracking are two separate logs. The system does not attempt to automatically calculate "how much chicken breast was consumed to make this batch of food packs," or otherwise derive one side from the other. Any such correlation, if ever wanted, is a deliberate future decision — not something v2 should build by default.

The operation values **speed and simplicity** above all else. Most data entry happens in a working kitchen, often from a phone, in the middle of food prep — so any workflow design must prioritize fast, low-friction entry over completeness of features.

---

## 2. Business Entities

These are the "nouns" of the business — the things staff track. Each is described by what it means to the business, not by its storage shape.

### Customer
A person or business the company sells food products to. Tracked with a name and optional contact details (phone, email, address). A customer can have many orders over time.

### Raw Material
An ingredient or packaging item the kitchen uses to make products — e.g. "Chicken Breast," "Cooking Oil," "Styrofoam Container." Each raw material belongs to a category (Meat, Vegetables, Oil, or Miscellaneous — the last of which also covers packaging) and has a unit of measure (grams, pieces, heads, etc.), which is simply descriptive text rather than a convertible unit system.

### Daily Consumption
A record that says: *on this date, this much of this raw material was used.* This is a **usage log entry**, not an inventory count — it tells you what happened, not how much stock remains. Multiple entries for the same material on the same day are normal (e.g., logging chicken usage separately for morning and afternoon prep); the business's daily total is simply the sum of all entries for that day, not a single running number.

### Product Type
A definition of something the business sells — e.g. "Food Pack," "Platter," "Bilao." This catalog entry is shared by two otherwise-unrelated processes: recording daily production output, and adding a line item to a customer's order.

### Daily Production
A record that says: *on this date, this much of this product type was produced.* Like Daily Consumption, this is a log entry, not a running inventory count, and multiple entries per day/product are expected. It optionally carries a free-text note describing what was actually included (useful because, e.g., the contents of a "Food Pack" can vary day to day).

### Purchase Order
A customer's order for one or more products. Each order has:
- A unique, system-generated order number
- A status reflecting where it stands: **Pending → In Progress → Completed**, or **Cancelled**
- One or more line items (see below)
- A running log of delivery/progress updates (see below)

### Purchase Order Item
A single line on an order: which product type, how many units were ordered, and how many have been fulfilled so far. Orders can be fulfilled in stages — a customer might order 100 food packs and receive them across three separate deliveries, with the item tracking cumulative progress toward the full quantity.

### Purchase Order Update
A log entry attached to an order recording something that happened — typically a delivery. It carries a free-text note (e.g., "Delivered 50 food packs, first batch of 2") and optionally the quantity delivered in that event. This is the order's audit trail: a chronological record of everything that happened to it.

### How entities relate
- A **Customer** has many **Purchase Orders**.
- A **Purchase Order** has many **Purchase Order Items**, each pointing to a **Product Type**.
- A **Purchase Order** has many **Purchase Order Updates**, forming its delivery history.
- **Raw Material** and **Product Type** each independently accumulate their own daily logs (**Daily Consumption**, **Daily Production**) — these two chains never intersect.

---

## 3. Core Workflows

These are the sequences of steps a staff member actually performs, end to end.

### Logging daily raw material consumption
1. Staff opens the consumption entry screen; the date defaults to today.
2. They select a raw material and enter the quantity used.
3. They can immediately continue to the next entry without leaving the screen ("add another" pattern) — this rapid-succession entry is the priority use case, since staff may be logging many materials back-to-back during prep.
4. Once done, they land on a consumption history view, which can be filtered by date range and by material category.
5. To correct a mistake, staff delete the wrong entry and add a fresh one — there is no in-place edit; append/delete is the intended correction pattern for this kind of log data.

### Logging daily production output
Same rapid-entry pattern as consumption: staff select a product type, enter the quantity produced, and optionally add a short note on what was actually included. Multiple entries per day are normal. History is viewed grouped by date. Corrections follow the same delete-and-re-add pattern as consumption.

### Managing the raw material catalog
Raw materials are reference data: staff can add, edit, or remove a raw material at any time. This catalog feeds the consumption-logging dropdown.

### Managing the product catalog
Product types are reference data with the same full add/edit/remove capability. This catalog feeds both the production-logging dropdown and the order line-item selector.

### Managing customers
Staff can add, edit, view, and remove customers. A customer's detail view shows all of their orders. A customer who has existing orders cannot be removed — their order history must be dealt with first (e.g., cancelled or otherwise resolved) before the customer record itself can go away, protecting sales history from accidental loss.

### Creating a purchase order
1. Staff start a new order and pick the customer.
2. In the same step, they add one or more line items inline — each a product type plus a quantity ordered.
3. On save, the order is created with status "Pending" and every item starts at zero fulfilled.
4. Staff land on the order's detail page.

### Tracking an order
The order detail view is the single place to see everything about an order: its status, order number, customer, each line item's ordered/fulfilled/remaining quantities and fulfillment percentage, and the full chronological update log — most recent activity first.

### Logging a delivery / progress update
When a delivery or partial delivery happens, staff add an update: a note describing what happened, and (when applicable) the quantity delivered. This update becomes part of the order's permanent history. Logging a delivery is the mechanism by which an order's fulfilled quantities and overall status move forward — as deliveries accumulate against an item, that item's fulfilled quantity rises, and once all items on an order are fully fulfilled, the order's status advances toward "Completed." An order that is "In Progress" reflects partial fulfillment across its items.

### Manually changing order status
Staff can also directly set an order's status as an override — useful for marking an order "Cancelled," or otherwise stepping outside the normal fulfillment-driven progression. Cancelled is treated as an end state: an order shouldn't casually flip back out of Cancelled through routine fulfillment activity — that requires a deliberate manual action.

### Removing an order
An order can be deleted outright, which removes it along with all of its line items and its full delivery history. This is a destructive, final action with no archive/undo — appropriate for correcting mistaken orders, not for cancelling real ones (use status change for that).

### Exporting data
Every one of the six operational record types — raw materials, consumption history, product catalog, production history, customers, and purchase orders — can be exported as a formatted report, in either spreadsheet (Excel) or PDF form, each carrying a title, an export timestamp, and a summary (e.g. total record count). This is a reporting capability for offline use, printing, or sharing outside the system — not a data-entry mechanism.

---

## 4. Business Rules & Constraints

- **Logs are append-only.** Daily Consumption and Daily Production are journals of events, not running balances. Multiple entries for the same day/material or day/product are expected and normal; totals are derived by summing entries for that day, not maintained as a single number.
- **No inventory or stock concept.** The system does not track "how much raw material is left" or "how many finished products are on hand." It only records what happened (usage, output), not what remains.
- **No automatic link between consumption and production.** The amount of a raw material used is never automatically calculated from — or checked against — the quantity of product produced. This separation is intentional business policy, not a missing feature; any change to this would be a deliberate future decision, not a default assumption for v2.
- **Corrections are delete-and-re-add**, not in-place editing, for consumption and production log entries.
- **A customer cannot be removed while they still have orders on record** — their order history has to be resolved first.
- **Order fulfillment is tracked at the line-item level** (quantity ordered vs. quantity fulfilled per item), and the order's overall status is a reflection of aggregate fulfillment across all of its items.
- **Order status is a four-state lifecycle:** Pending → In Progress → Completed, with Cancelled as a separate terminal state reachable from any point via manual action. Fulfillment activity should not silently move a Cancelled order back into the normal flow.
- **Every order gets a unique, system-generated order number** at creation, used to identify it on all documents and exports.
- **Removing a raw material or product type from the catalog also removes the historical records/order references that depend on it.** This is a real consequence to warn staff about before retiring a catalog item that has usage history — v2 should decide deliberately whether to keep this cascading behavior, block deletion when history exists (as with customers), or introduce an archive/deactivate option instead of hard deletion.

---

## 5. User Roles

No public signup exists — every account is created by an administrator. The intended access model has three roles:

- **Admin** — full control of the system: can manage user accounts (create, edit, deactivate/remove staff logins) in addition to everything Management can do.
- **Management** — the people running day-to-day operations (business owner, secretary/office staff): full operational access — raw materials, production, consumption, customers, orders, and reporting/exports. Cannot manage other users' accounts.
- **Viewer** — read-only access to all operational data (catalogs, logs, customers, orders, reports) with no ability to create, edit, or delete anything. Intended for someone who needs visibility without operational responsibility.

---

## 6. Reporting

Reporting is a first-class business capability, not an afterthought: any of the six operational record sets can be pulled out as a formatted, shareable report (spreadsheet or PDF) for offline use — handing to an accountant, printing for a physical file, or reviewing outside the system.

---

## 7. Guiding Principles for v2 (Explicit Non-Goals)

- **Simplicity over feature richness.** The business explicitly prefers a lean, fast tool over a feature-complete one. Do not add inventory management, automated conversion logic between raw materials and production, forecasting, or similar capabilities unless the business asks for them directly.
- **Speed of entry is a hard UX constraint**, not a nice-to-have — most data entry happens live, in a kitchen, often on a phone. Any workflow redesign for v2 should be evaluated against "can this be entered quickly, with minimal taps/screens" first.
- **Kitchen tracking and sales tracking remain separate domains** unless the business explicitly decides otherwise.
