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

# 5. Start the app
npm run dev
```

Open **http://localhost:3000**. The inventory page is at **/inventory**.

### Check that everything works

Run these in order. If all pass, you're ready to start your ticket.

| Command | What it checks | Expected result |
|---|---|---|
| `node -v` | Node version | v22.x or higher |
| `npm run db:check` | Database connection and tables | `Database OK. Materials in DB: 0` |
| `npm run lint` | Code style problems | No errors |
| `npm run build` | The whole app compiles | Build completes without errors |
| Open http://localhost:3000/inventory | The page loads | Page renders, no error screen |

---

## Git Workflow

**`develop` is our base branch.** Never commit directly to `develop` or `main`.

```bash
# 1. Get the latest develop
git checkout develop
git pull origin develop

# 2. Create your branch, named after your ticket
git checkout -b INV-4-add-material

# 3. Work, then commit (start messages with the ticket ID)
git add <files you changed>
git commit -m "INV-4: save new material to database"

# 4. Format, then push
npx prettier --write .
git push -u origin INV-4-add-material
```

5. Open a Pull Request **into `develop`** and ask a teammate to review.
6. After it is merged, go back to step 1 for your next ticket.

**Branch name format:** `TICKET-ID-short-description` (lowercase, hyphens).

**Do not use `git add .`**. Add files by name so you don't commit `.env`, database files, or tool folders by accident.

**Pulled changes and something broke?**

```bash
npm install
npx prisma migrate dev
```

---

## Viewing the Database

The database is a single file called `dev.db` in the project root. It is created on your machine and is **not** committed to Git. Each teammate has their own copy.

To look at the data: install the **SQLite Viewer** extension in VS Code, then click `dev.db` in the file explorer.

> Prisma Studio (`npx prisma studio`) currently fails on our setup. Use the VS Code extension instead.

---

## Changing the Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <what-changed>`
3. Commit the new folder in `prisma/migrations/`
4. Tell the team to run `npx prisma migrate dev` after pulling

> Always use **Prisma 7**. Do not run `npm install prisma` without a version, because it installs Prisma 8, which does not work with this project. Use `prisma@7`.

---

## Architecture Decisions (ADR)

### ADR-001: Next.js App Router
- **Decision:** Use Next.js with the App Router, one folder per feature under `app/`.
- **Why:** Pages and server code live in one project, and server actions let us read and write the database without a separate API.

### ADR-002: Prisma 7 + SQLite
- **Decision:** Prisma 7 as the ORM, SQLite as the database.
- **Why:** SQLite needs no server or account, so everyone can run the project in minutes. Prisma gives typed queries and migrations. Prisma 8 is still a release candidate, so we stay on 7.
- **Trade-off:** SQLite does not work well on hosts like Vercel. If we deploy online, we switch to Postgres.

### ADR-003: Server actions for data changes
- **Decision:** Add, edit, and delete are server actions in `app/<feature>/actions.ts`.
- **Why:** Data is saved to the database instead of disappearing on refresh, with less code than API routes.

### ADR-004: Server page + client UI
- **Decision:** Each `page.tsx` loads data on the server and passes it as props to a client component for forms and modals.
- **Why:** Database code stays off the browser; interactive UI stays simple.

### ADR-005: Prettier for formatting
- **Decision:** All code is formatted with Prettier. No minified or one-line files.
- **Why:** Readable code and clean PR diffs.

### ADR-006: Inventory has no stock balances yet
- **Decision:** Inventory is a material catalog plus a consumption log. Stock balances come later, once Production and Purchase Orders exist.
- **Why:** Balances depend on data from other modules.

---

## Common Problems

| Problem | Fix |
|---|---|
| `Environment variable not found: DATABASE_URL` | You skipped step 3. Copy `.env.example` to `.env`. |
| Cannot find module `generated/prisma/client` | Run `npx prisma generate`, then restart `npm run dev`. |
| Tables missing or database is messy | Run `npx prisma migrate reset` (deletes your local data). |
| `npm run db:check` fails | Run `npx prisma migrate dev`, then try again. |

---

## Project Structure

```
app/
  inventory/         Material catalog + consumption log
  login/
  production/
  purchase-orders/
  team/
components/ui/       Shared UI components
lib/db.ts            Prisma client
prisma/
  schema.prisma      Database models
  migrations/        Committed migration history
scripts/
  check-db.ts        Database connection check
dev.db               Local database (not committed)
```