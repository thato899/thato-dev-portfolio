# Thato Junior Maluleka — Portfolio of Evidence

A full-stack portfolio: the public site, and a `/dashboard` behind it for
adding projects and events without touching code.

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Prisma ·
Auth.js (single-admin credentials login) · Tailwind CSS v4 · Framer Motion ·
Vercel Blob (production image uploads).

## Local development

Needs a Postgres database — either a local one via Docker, or a free
[Neon](https://neon.tech) database (the same one you'll use in production
works fine for dev too). Uploaded images save under `/public/uploads` in
dev, regardless of which database you use.

```bash
# Option A: local Postgres via Docker (no account needed)
docker run -d --name portfolio-postgres -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=portfolio -p 5433:5432 postgres:16-alpine
# then set in .env: DATABASE_URL="postgresql://postgres:devpassword@localhost:5433/portfolio"

npm install
npm run db:migrate   # applies prisma/migrations against DATABASE_URL
npm run db:seed      # adds a placeholder project + event
npm run dev
```

(Stop/start the container later with `docker stop|start portfolio-postgres`
— data persists in the container until it's removed.)

Open [http://localhost:3000](http://localhost:3000) for the site, and
[http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the
admin. `.env.local` already has a placeholder admin login wired up:

- **Email:** whatever is set as `ADMIN_EMAIL` in `.env.local`
- **Password:** `portfolio-admin-2026`

**Change that password before this ever goes anywhere real:**

```bash
npm run hash-password -- "your-new-password"
# paste the printed ADMIN_PASSWORD_HASH into .env.local
```

> `$` in a bcrypt hash must stay escaped as `\$` in `.env*` files — Next.js
> treats a bare `$NAME` as a variable reference and will silently corrupt
> the hash otherwise. `hash-password` already escapes it for you.

## Deploying (Vercel + Neon + Blob)

All done from [vercel.com](https://vercel.com) — no CLI needed:

1. **Import the repo:** vercel.com → Add New → Project → import
   `thato899/thato-dev-portfolio` from GitHub.
2. **Database:** in the project's Storage tab, add Postgres (Neon) —
   this auto-fills `DATABASE_URL`. `npm run build` runs
   `prisma migrate deploy` automatically, so the schema is created on the
   first deploy — no manual migration step needed.
3. **Images:** in the same Storage tab, add Blob — this auto-fills
   `BLOB_READ_WRITE_TOKEN`. Uploads switch from local disk to Blob
   automatically once that variable exists (serverless has no persistent
   disk).
4. **Env vars:** in Project Settings → Environment Variables, add
   `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (values from your
   local `.env.local` — but paste the **unescaped** hash here; Vercel's UI
   isn't a dotenv parser, so no `\$` needed).
5. Deploy. Every push to `main` redeploys automatically after this.

## Project structure

```text
prisma/schema.prisma        Project & Event models
lib/db.ts                   Prisma client
lib/auth.ts                 Auth.js config (single admin, env-based)
lib/storage.ts               Image upload (Vercel Blob in prod, local disk in dev)
lib/actions/                Server Actions: create/update/delete/reorder
lib/validation.ts           Zod schemas shared by the actions
app/page.tsx                 Public site (Server Component, reads the DB directly)
app/components/              Hero, sections, nav, shared UI
app/dashboard/                Admin: overview, projects, events (protected by proxy.ts)
app/login/                    Dashboard sign-in
```

## Security notes

- The dashboard has one identity, defined entirely by env vars — there's no
  user table and no credentials in the codebase.
- `proxy.ts` (Next.js 16's replacement for `middleware.ts`) blocks
  `/dashboard/**` for anyone without a valid session; each Server Action
  also re-checks the session server-side.
- Uploaded files are validated by extension and real image content before
  being stored.
