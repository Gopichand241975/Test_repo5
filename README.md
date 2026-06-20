# Workbench

A project log for hobbyist makers — woodworkers, knitters, 3D-printing tinkerers,
and anyone else with a workbench — to track in-progress projects and the materials
and costs that go into them.

Built for the **H0: Hack the Zero Stack** hackathon (Open Innovation track),
using **Vercel v0 / Next.js** for the frontend and **Aurora PostgreSQL** for the database.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database:** Amazon Aurora PostgreSQL
- **Auth:** Email/password with bcrypt password hashing and JWT session cookies (`jose`)
- **Deployment:** Vercel

## Data model

```
users (id, email, password_hash, display_name, created_at)
  └─< projects (id, user_id, title, category, status, description, created_at, updated_at)
        └─< materials (id, project_id, name, quantity, unit, unit_cost, created_at)
```

A `project_costs` view computes the running total cost and material count per
project with a `SUM(quantity * unit_cost)` aggregate, used to power the dashboard.

See `db/schema.sql` for the full schema, including indexes on the foreign
keys used by the app's main queries.

## Local setup

1. **Provision an Aurora PostgreSQL cluster** in AWS (or use any PostgreSQL
   instance for local development).
2. **Run the schema:**
   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```
3. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in:
   - `DATABASE_URL` — your Aurora PostgreSQL connection string
   - `SESSION_SECRET` — a random string (e.g. `openssl rand -base64 32`)
4. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add `DATABASE_URL` and `SESSION_SECRET` as environment variables in the
   Vercel project settings.
4. Make sure your Aurora cluster's security group / VPC allows inbound
   connections from Vercel (or use the RDS Data API / a connection pooler
   such as RDS Proxy if running Aurora Serverless v2 with restricted networking).
5. Deploy.

## Folder structure

```
app/
  page.tsx                  Dashboard (lists projects, requires login)
  login/, signup/           Auth pages
  projects/new/             Create project form
  projects/[id]/            Project detail + materials table
  api/auth/...               Signup / login / logout routes
  api/projects/...           Project CRUD
  api/materials/...          Material create / delete
lib/
  db.ts                      Aurora PostgreSQL connection pool
  auth.ts                    Password hashing + session cookie helpers
components/
  Header, ProjectCard, StatusBadge, PriceTag
db/
  schema.sql                 Full Aurora PostgreSQL schema
```
