# CBVT Catering Division: Kitchen Management App

A web app for managing a kitchen: inventory, production, purchase orders, and team.

Built with Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Prisma 7, and SQLite.

---

## Quick Start (new teammates)

Use **Git Bash** or **PowerShell**. You need **Node.js 22 or newer** (`node -v` to check).

```bash
# 1. Clone and switch to the develop branch
git clone <repo-url>
cd <repo-folder>
git checkout develop

# 2. Install dependencies (this also generates the Prisma client)
npm install

# 3. Create your local env file
cp .env.example .env          # Git Bash
# copy .env.example .env      # PowerShell / cmd

# 4. Create your local database and tables
npx prisma migrate dev

# 5. Load the sample data
npx prisma db seed

# 6. Start the app
npm run dev
```

The seed command loads sample data into your local database so the pages have records to display and you have demo accounts to sign in with.

Open **http://localhost:3000**. The inventory page is at **/inventory**.

### Check that everything works

Run these in order. If all pass, you're ready to start your ticket.

| Command                              | What it checks                        | Expected result                                              |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------ |
| `node -v`                            | Node version                          | v22.x or higher                                              |
| `npm run db:check`                   | Database connection and seeded tables | Users: 3; materials: 8 (low stock: 3); batches: 4; orders: 3 |
| `npm run lint`                       | Code style problems                   | No errors                                                    |
| `npm run build`                      | The whole app compiles                | Build completes without errors                               |
| Open http://localhost:3000/inventory | The page loads                        | Page renders, no error screen                                |

### Demo accounts

Use these accounts for local development and testing only:

| Email                 | Password   |
| --------------------- | ---------- |
| `juan@cbvtkitchen.ph` | `demo1234` |
| `ana@cbvtkitchen.ph`  | `demo1234` |
| `rico@cbvtkitchen.ph` | `demo1234` |

These are seeded development accounts. Do not use them in production.

---

## Git Workflow

**`develop` is our base branch.** Never commit directly to `develop` or `main`.

**Before starting work:** pull the latest `develop` branch before creating your ticket branch.

**Before opening a PR:** pull the latest `develop` again and resolve any conflicts on your ticket branch before requesting review.

```bash
# 1. Get the latest develop
git checkout develop
git pull origin develop

# 2. Create your branch, named after your ticket
git checkout -b INV-11-list-materials

# 3. Work, then commit (start messages with the ticket ID)
git add <files you changed>
git commit -m "INV-11: load materials from database"

# 4. Format, then push
npx prettier --write .
git push -u origin INV-11-list-materials

# 5. Before opening the PR, update your branch with develop
git fetch origin
git merge origin/develop
# Resolve conflicts if there are any, then push
git push
```

Open a Pull Request **into `develop`** and ask a teammate to review.

**Branch name format:** `TICKET-ID-short-description` (lowercase, hyphens).

**Do not use `git add .`**. Add files by name so you don't commit `.env`, database files, or tool folders by accident.

**Do not change `prisma/schema.prisma` without PM approval.** The schema is final; schema changes are not part of ordinary feature work.

See [`TICKETS.md`](TICKETS.md) for the ticket list, implementation requirements, and project rules.

**Pulled changes and something broke?**

```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

---

## Viewing the Database

The database is a single file called `dev.db` in the project root. It is created on your machine and is **not** committed to Git. Each teammate has their own copy.

To look at the data: install the **SQLite Viewer** extension in VS Code, then click `dev.db` in the file explorer.

> Prisma Studio (`npx prisma studio`) currently fails on our setup. Use the VS Code extension instead.

---

## Changing the Database Schema

**The schema is final. Changes need PM approval, always as a new migration.**

Do not edit the schema as part of a normal feature ticket. If a schema change is approved:

1. Get explicit PM approval before making the change.
2. Edit `prisma/schema.prisma` only as approved.
3. Create a new migration with `npx prisma migrate dev --name <what-changed>`.
4. Never edit or rewrite an existing migration.
5. Commit the new folder in `prisma/migrations/`.
6. Tell the team to run `npx prisma migrate dev` after pulling.

> Always use **Prisma 7**. Do not run `npm install prisma` without a version, because it installs Prisma 8, which does not work with this project. Use `prisma@7`.

---

## How the Code Is Organized

The project is a modular monolith. Each feature lives in `modules/<feature>/`, with a clear boundary between database access, business rules, and the Next.js UI.

### Module layers

| File            | Job                                                                                                                               | Must NOT                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `repository.ts` | The only layer that imports `@/lib/db`. Contains plain database queries.                                                          | Contain business rules.                        |
| `service.ts`    | Contains business rules and validation. Calls its own repository and other modules only through their `index.ts` public API.      | Import Prisma or access the database directly. |
| `actions.ts`    | Uses `"use server"`. Checks the user, calls the service, revalidates paths, and returns an action result such as `{ ok, error }`. | Contain business rules or database queries.    |
| `index.ts`      | Public API: exports read functions and types that other modules and pages may use.                                                | Export repository or service internals.        |
| `types.ts`      | Holds module types and allowed values for string fields such as roles, statuses, and categories.                                  | —                                              |

### Request and data flow

```text
Server page (app/<feature>/page.tsx)
    reads through -> modules/<feature>/index.ts (public API)
    passes props to -> components/<feature>/* (client UI)

Client UI -> modules/<feature>/actions.ts
          -> service.ts
          -> repository.ts
          -> Prisma / SQLite
```

### Allowed module dependencies

| Module                      | May call                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| `team`                      | Nothing                                                          |
| `inventory`                 | `team`                                                           |
| `production`                | `team`                                                           |
| `purchase-orders`           | `team`, `inventory`                                              |
| `overview` (`app/page.tsx`) | `team`, `inventory`, `production`, `purchase-orders` (read only) |

**Inventory and production must never import purchase-orders.** Modules must use another module's `index.ts` public API; never import another module's repository or service directly.

---

## Architecture Decisions (ADR)

### ADR-001: Next.js App Router

- **Decision:** Use Next.js with the App Router for pages and routing. Feature business logic lives in `modules/<feature>/`, not in the `app/` route folders.
- **Why:** Pages and server code live in one project, and server actions let us read and write the database without a separate API.

### ADR-002: Prisma 7 + SQLite

- **Decision:** Prisma 7 as the ORM, SQLite as the database.
- **Why:** SQLite needs no server or account, so everyone can run the project in minutes. Prisma gives typed queries and migrations. Prisma 8 is still a release candidate, so we stay on 7.
- **Trade-off:** SQLite does not work well on hosts like Vercel. If we deploy online, we switch to Postgres.

### ADR-003: Server actions for data changes

- **Decision:** Add, edit, and other data-changing operations are server actions in `modules/<feature>/actions.ts`.
- **Why:** Data is saved to the database instead of disappearing on refresh, with less code than API routes. Actions are the boundary between client UI and server-side services.

### ADR-004: Server page + client UI

- **Decision:** Each `page.tsx` loads data on the server and passes it as props to a client component for forms and modals.
- **Why:** Database code stays off the browser; interactive UI stays simple.

### ADR-005: Prettier for formatting

- **Decision:** All code is formatted with Prettier. No minified or one-line files.
- **Why:** Readable code and clean PR diffs.

### ADR-006: Inventory balances come from the stock movement ledger

- **Decision:** Current stock balances are calculated from the stock movement ledger. Balances are never stored as a separate value.
- **Why:** The ledger is the source of truth for stock changes. Calculating balances from movements avoids a separately stored balance becoming inconsistent with the movement history.

### ADR-007: Modular monolith and module boundaries

- **Decision:** Keep the application as a modular monolith. Each feature owns a module under `modules/<feature>/` with `types.ts`, `repository.ts`, `service.ts`, `actions.ts`, and `index.ts`. UI components live separately under `components/<feature>/`.
- **Layer rules:**
  - `repository.ts` is the only file that imports `@/lib/db`; it contains plain queries, not business rules.
  - `service.ts` owns business rules and validation. It calls its own repository and other modules only through their `index.ts`.
  - `actions.ts` uses `"use server"`, checks the user, calls the service, revalidates paths, and returns an action result. It contains no business rules or queries.
  - `index.ts` is the module's public API. It exports read functions and types, not repository or service internals.
  - `types.ts` contains module types and allowed values for string fields.
- **Allowed dependencies:**

  | Module                      | May call                                                         |
  | --------------------------- | ---------------------------------------------------------------- |
  | `team`                      | Nothing                                                          |
  | `inventory`                 | `team`                                                           |
  | `production`                | `team`                                                           |
  | `purchase-orders`           | `team`, `inventory`                                              |
  | `overview` (`app/page.tsx`) | `team`, `inventory`, `production`, `purchase-orders` (read only) |

- **Additional rule:** Inventory and production must never import purchase-orders. Cross-module calls must go through the other module's `index.ts`.

### ADR-008: shadcn/ui stays installed but frozen

- **Decision:** Keep shadcn/ui installed in the project, but treat it as frozen. Do not add, remove, regenerate, or broadly modify shadcn components as part of feature work unless the PM explicitly approves it.
- **Why:** The current project setup and components remain available, while avoiding unplanned changes to the shared UI foundation.

### ADR-009: Nothing is hard-deleted

- **Decision:** Records are not hard-deleted. Use the appropriate lifecycle action: archive materials, void production batches, deactivate team members, and cancel purchase orders.
- **Why:** Historical records and references must remain available and understandable. Past activity should not be erased by removing the underlying record.

### ADR-010: No role-based access except PO approval

- **Decision:** There are no role-based access restrictions in the application. Once signed in, users can access every page and action. The sole exception is purchase-order approval: only a user with the `ADMIN` role can approve a purchase order.
- **Why:** Roles are labels for the team except where the purchase-order approval workflow explicitly requires an admin decision.

---

## Common Problems

| Problem                                        | Fix                                                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Environment variable not found: DATABASE_URL` | You skipped step 3. Copy `.env.example` to `.env`.                                                         |
| Cannot find module `generated/prisma/client`   | Run `npx prisma generate`, then restart `npm run dev`.                                                     |
| Tables missing or database is messy            | Run `npx prisma migrate reset`. This deletes your local data and automatically runs the seed script again. |
| Pages are empty or no one to sign in as        | Run `npx prisma db seed` to load the sample data and demo accounts.                                        |
| `npm run db:check` fails                       | Run `npx prisma migrate dev`, then `npx prisma db seed`, then try again.                                   |

---

## Project Structure

```text
app/
  inventory/
    page.tsx
  login/
    page.tsx
  production/
    page.tsx
  purchase-orders/
    page.tsx
  team/
    page.tsx
  page.tsx                 Overview page

modules/
  inventory/
    actions.ts
    index.ts
    repository.ts
    service.ts
    types.ts
  production/
    actions.ts
    index.ts
    repository.ts
    service.ts
    types.ts
  purchase-orders/
    actions.ts
    index.ts
    repository.ts
    service.ts
    types.ts
  team/
    actions.ts
    index.ts
    repository.ts
    service.ts
    types.ts

components/
  inventory/
  production/
  purchase-orders/
  team/
  overview/

lib/
  db.ts                    Prisma client
  result.ts                Shared action result type

prisma/
  schema.prisma            Database models
  migrations/              Committed migration history
  seed.ts                  Development sample data

scripts/
  check-db.ts              Database connection and seed check

dev.db                     Local database (not committed)
```
