# CBVT Kitchen: Development Tickets

Schema v2 is **final** (`schema.proposed.prisma`). Mock UIs stay as they are and get real data.

**Sizes:** S = under 1 hr, M = 1 to 2 hrs, L = 2 to 4 hrs.
**Branch name:** `TICKET-ID-short-description`, e.g. `PROD-3-queue-batch`. PRs go into `develop`.

> The old INV-2 to INV-10 tickets are retired. Inventory tickets continue from **INV-11** so no ID is used twice. The old INV-1 (Prisma setup) stays done.

---

## How every module is built

```
Server page (app/<x>/page.tsx)
   reads via  -> modules/<x>/index.ts   (public API)
   passes props to -> components/<x>/*   (client UI, replaces data.ts mock data)

Client UI -> modules/<x>/actions.ts -> service.ts -> repository.ts -> Prisma
```

| File            | Job                                                                                                       | Must NOT                               |
| --------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `repository.ts` | Only file that imports `@/lib/db`. Plain queries.                                                         | contain business rules                 |
| `service.ts`    | Business rules and validation. Calls its own repository, and other modules only through their `index.ts`. | import Prisma                          |
| `actions.ts`    | `"use server"`. Checks the user, calls the service, `revalidatePath`, returns `{ ok, error }`.            | contain rules or queries               |
| `index.ts`      | Public API: read functions and types other modules and pages may use.                                     | export repository or service internals |
| `types.ts`      | Types and the allowed values for string fields (roles, statuses, categories).                             |                                        |

**Allowed dependencies**

| Module                    | May call                                                 |
| ------------------------- | -------------------------------------------------------- |
| team                      | nothing                                                  |
| inventory                 | team                                                     |
| production                | team                                                     |
| purchase-orders           | team, inventory                                          |
| overview (`app/page.tsx`) | team, inventory, production, purchase-orders (read only) |

Inventory and production must never import purchase-orders.

## Definition of done (every ticket)

- [ ] `npx prettier --write .`, `npm run lint`, and `npm run build` pass
- [ ] The feature uses the database, not `data.ts` or a hardcoded array
- [ ] Verified in the SQLite viewer on `dev.db`
- [ ] Mock `data.ts` for that feature is deleted once nothing uses it
- [ ] New code is in the right layers: queries in `repository.ts`, rules in `service.ts`, the server action in `actions.ts`, and anything other modules need exported from `index.ts`
- [ ] PR into `develop`, reviewed by one teammate

---

## Foundation (do first, in order)

**DB-1 · Apply schema v2** · S

- Replace the models in `prisma/schema.prisma` with `schema.proposed.prisma` (keep `generator` and `datasource`)
- New migration named `schema_v2` (do not edit the `init` migration)
- `npx prisma generate` runs and the app still compiles

**DB-2 · Seed script** · M · needs DB-1

- `prisma/seed.ts` loads users, settings, materials, stock movements, suppliers, purchase orders, and production batches that match the mockups
- Running it twice does nothing the second time
- `bcryptjs` is installed and `seed` is set in `prisma7.config.ts`

**ARCH-1 · Module skeleton and rules** · M · needs DB-1

- Each module folder has `types.ts`, `repository.ts`, `service.ts`, `actions.ts`, and `index.ts` with at least one working read function
- Shared `ActionResult` type in `lib/`
- Lint rule: only `repository.ts` files may import `@/lib/db`, and no file may import another module's `service` or `repository`
- Temporary `getCurrentUser()` in team returns the seeded admin, to be replaced by LOG-4

**ARCH-2 · Cleanup** · S

- Remove leftover shadcn pieces if nothing uses them (`components.json`, `components/ui/button.tsx`, `lib/utils.ts`)
- Rename `overvoew-recent-orders.tsx` to `overview-recent-orders.tsx`

**DOC-1 · README and ADRs for the module structure** · S · after ARCH-1

- Module layer rules, dependency table, seed step, demo password

---

## Team (TEAM)

**TEAM-1 · List members** · M · needs ARCH-1

- Team page loads users from the database into `member-list`
- Shows initials, name, role, and active state
- `listUsers` and `getUserById` exported from `modules/team/index.ts`

**TEAM-2 · Add member** · M · needs TEAM-1

- Modal saves name, email (unique, valid), and role
- System generates a temporary password and shows it once to the admin (password is hashed with `bcryptjs`)

**TEAM-3 · Edit member** · M · needs TEAM-1

- Edit modal is prefilled; name and role can change
- Email change is rejected if already used

**TEAM-4 · Deactivate and reactivate** · M · needs TEAM-1

- "Remove" asks for confirmation, then sets `isActive` to false (no delete)
- Admin cannot deactivate themselves or the last active admin
- Inactive users stay visible on past records

**TEAM-5 · Workspace settings** · M · needs ARCH-1

- Settings panel loads and saves `WorkspaceSetting` (name, prep reminders, require PO approval)
- `getSettings` exported for other modules

---

## Login (LOG)

**LOG-1 · Auth foundation** · L · needs DB-2

- Verify email and password against `User` (hashed), reject inactive users
- Signed, httpOnly session cookie helper in `lib/`
- Generic error message ("Invalid email or password"), never reveals which part was wrong

**LOG-2 · Wire the login form** · M · needs LOG-1

- `login-form` submits to a server action, shows errors, redirects to `/`
- "Remember me" sets a longer cookie lifetime
- "Demo mode" text removed; "Forgot password?" link hidden for v1

**LOG-3 · Route protection** · M · needs LOG-1

- Signed-out visitors are redirected to `/login` from every other page
- Signed-in users visiting `/login` go to `/`

**LOG-4 · Logout and current user** · S · needs LOG-3

- Shell shows the real name and initials with a Sign out button
- Replaces the temporary `getCurrentUser()` from ARCH-1
- Overview greeting uses the signed-in user (see OVR-7)

> **No role checks.** Once signed in, a user can use every page and action. The one exception is PO-4: only an `ADMIN` can approve a purchase order. Roles are otherwise just labels.

---

## Inventory (INV)

**INV-11 · List materials from the database** · M · needs DB-2, ARCH-1

- `page.tsx` is a server component; `inventory-client.tsx` receives props
- Each row shows unit, category, and current balance
- Archived materials are not shown

**INV-12 · Add material** · M · needs INV-11

- Name required and unique (case-insensitive), category from the allowed list, unit required, optional reorder level (not negative)
- List refreshes without a manual reload; errors show in the form

**INV-13 · Edit material** · M · needs INV-11

- Edit opens a prefilled modal for name, category, unit, and reorder level

**INV-14 · Archive material ("Remove")** · S · needs INV-11

- Confirmation first, then sets `archivedAt`
- Past movements and purchase order lines still show the material name
- Archived materials disappear from lists and dropdowns

**INV-15 · Search and category filter** · S · needs INV-11

- Search box filters by name; category filter works together with it

**INV-16 · Log consumption** · M · needs INV-11

- Modal: material dropdown (active materials), quantity above 0, optional note
- Creates a `CONSUMPTION` movement stored as a negative number for the signed-in user
- Rejects an amount that would make the balance negative

**INV-17 · Movement history and low-stock badge** · M · needs INV-16

- Latest 20 movements: material, type, quantity, note, who, when
- Low-stock badge when balance is at or below the reorder level

**INV-18 · Inventory public API** · M · needs ARCH-1 (can run in parallel with INV-11)

- Exported from `modules/inventory/index.ts`: `listActiveMaterials`, `getLowStock`, `getWasteRate(period)`, `recordMovement`, `recordReceipt(poId, lines)`
- `recordReceipt` is safe to call twice for the same PO (no double stock)
- `getWasteRate(period)` = number of `WASTE` movements divided by the number of `CONSUMPTION` + `WASTE` movements in the period. It counts movements instead of adding quantities, because units differ (kg, cans, liters). Returns the previous period's rate too, and nothing when there were no movements

---

## Production (PROD)

**PROD-1 · List batches** · M · needs ARCH-1

- `production-history` loads today's non-voided batches, newest first
- Shows name, portions, status, and "Recorded by <name>"
- Record counter in the header matches the list

**PROD-2 · Log production (rapid entry)** · M · needs PROD-1

- Form and modal save date, batch name, portions (above 0), and notes as a `RECORDED` batch
- Form clears after saving and the history updates

**PROD-3 · Queue a batch and change status** · M · needs PROD-1

- Create a `QUEUED` batch with scheduled time and target portions
- Move it `QUEUED` to `IN_PROGRESS` to `RECORDED`; a recorded batch cannot go back

**PROD-4 · Void a batch** · S · needs PROD-1

- Confirmation first, then sets `voidedAt`; the row stays in the database
- Voided batches are excluded from the list and from completion numbers

**PROD-5 · Production public API** · M · needs ARCH-1

- `getTodaySchedule()` and `getCompletion(period)` exported from `modules/production/index.ts`
- Completion = recorded batches divided by all non-voided batches in the period

**PROD-6 · Validation and empty states** · S · last

- Clear errors for missing name or zero portions; message when there are no records today

---

## Purchase orders (PO)

**PO-1 · List and filter orders** · M · needs ARCH-1

- `order-history` loads orders with supplier, expected date, status, and number of lines
- Status filter works

**PO-2 · Create purchase order** · L · needs PO-1, INV-18

- Pick a supplier (or add a new one inline), then one or more product lines chosen from active inventory materials
- Service generates the next `PO-xxxx` number inside a transaction
- Needs at least one line, and each quantity above 0

**PO-3 · Update status and expected date** · M · needs PO-1

- Update modal moves the order through `AWAITING`, `CONFIRMED`, `IN_TRANSIT`, `DELIVERED`
- Invalid jumps (for example back from `DELIVERED`) are rejected

**PO-4 · Approval flow** · M · needs PO-3, TEAM-5

- When "Require admin approval" is on, an order must be approved before it can move to `CONFIRMED`
- Only a user with the `ADMIN` role can approve (the one role check in the app); approver and time are stored
- When the setting is off, orders skip approval

**PO-5 · Delivery adds stock** · M · needs PO-3, INV-18

- Marking `DELIVERED` calls `inventory.recordReceipt` in the same transaction
- Receiving the same order twice never doubles the stock

**PO-6 · Cancel order** · S · needs PO-3

- Replaces the Delete button: confirmation, then status `CANCELLED`
- Delivered orders cannot be cancelled

**PO-7 · Purchase orders public API** · S · needs ARCH-1

- `getOpenCount()` and `getRecentOrders(limit)` exported from the module index

---

## Overview (OVR) (`app/page.tsx`)

**OVR-1 · Server page and period filter** · M · needs ARCH-1

- Page becomes a server component; the period select (This week, This month, Last week) is read from the URL
- Components in `components/overview/` get props instead of `data.ts`

**OVR-2 · Recent purchase orders and open-orders metric** · S · needs PO-7

- Metric card and the list of the three latest orders

**OVR-3 · Prep completion, chart, and schedule** · M · needs PROD-5

- Metric, seven-day chart, and today's prep schedule come from the production API

**OVR-4 · Low stock metric and notice** · S · needs INV-18

- Count and "needs attention" banner come from inventory; closing the banner is client-only

**OVR-5 · Waste metric** · S · needs INV-18

- Waste percentage and the change from the previous period come from `getWasteRate`
- Shows a dash when there were no movements in the period

**OVR-6 · "Log activity" modal** · M · needs INV-18, PROD-2

- Production batch, Waste record, and Stock count each save to the right place
- Modal gains the fields they need (material and quantity for waste and stock count)

**OVR-7 · Greeting from the signed-in user** · S · needs LOG-4

- "Good morning, <first name>." with time-of-day wording

---

## Waves

Tickets inside a wave can all be worked in parallel. A wave starts when the tickets it depends on are merged.

| Wave         | Tickets                                                                                                                               | Needs                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **0** (done) | DB-1, DB-2, ARCH-1                                                                                                                    |                                                 |
| **1**        | LOG-1, TEAM-1, TEAM-5, INV-11, INV-18, PROD-1, PROD-5, PO-1, PO-7, OVR-1 (plus ARCH-2 and DOC-1, any time)                            | wave 0                                          |
| **2**        | LOG-2, LOG-3, TEAM-2, TEAM-3, TEAM-4, INV-12, INV-13, INV-14, INV-15, INV-16, PROD-2, PROD-3, PROD-4, PO-2, PO-3, OVR-2, OVR-3, OVR-4 | their wave 1 ticket (see each ticket's "needs") |
| **3**        | LOG-4, INV-17, PO-4, PO-5, PO-6, OVR-5, OVR-6                                                                                         | wave 2 tickets                                  |
| **4**        | OVR-7, PROD-6                                                                                                                         | LOG-4 and the rest of production                |

Wave 1 is one person per module: Login, Team, Inventory, Production, Purchase orders, Overview.

## Decisions (closed)

1. **PO approval:** yes. When the setting is on, an admin must approve before `CONFIRMED` (PO-4).
2. **Cancel vs delete:** cancel (PO-6).
3. **Permissions:** none. Signed in means full access. Only PO approval checks for `ADMIN`.
4. **Waste rate:** by count of movements, not quantity (INV-18, OVR-5).
