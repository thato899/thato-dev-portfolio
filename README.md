# Thato Junior Maluleka — Portfolio of Evidence

A full-stack portfolio: the public site, and a `/dashboard` behind it for
adding projects and events without touching code.

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Prisma ·
Auth.js (single-admin credentials login) · Tailwind CSS v4 · Framer Motion ·
Vercel Blob (production image uploads).

## Local development

Uses the same free [Neon](https://neon.tech) Postgres database as
production — one database serves both, which is simplest at this scale.
`DATABASE_URL`/`DATABASE_URL_UNPOOLED` are already in `.env` (and were
pulled into `.env.local` by the Vercel CLI when the project was linked —
run `vercel env pull .env.local` again any time to refresh them). Uploaded
images save under `/public/uploads` locally unless `BLOB_READ_WRITE_TOKEN`
is set (it already is, via `.env.local`), in which case they go straight
to the real Vercel Blob store.

```bash
npm install
npm run db:migrate   # applies prisma/migrations against DATABASE_URL
npm run db:seed      # adds a placeholder project + event (skips if data exists)
npm run dev
```

Prefer an isolated local database instead of sharing prod's? Run Postgres
in Docker and point `.env`'s `DATABASE_URL`/`DATABASE_URL_UNPOOLED` at it:

```bash
docker run -d --name portfolio-postgres -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=portfolio -p 5433:5432 postgres:16-alpine
# DATABASE_URL="postgresql://postgres:devpassword@localhost:5433/portfolio"
```

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

Already set up: the GitHub repo is linked to a Vercel project
(`thato-malulekas-projects/thato-dev-portfolio`), with Neon Postgres and a
public Blob store both provisioned and connected, and `AUTH_SECRET` /
`ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` set across Production, Preview, and
Development. Every push to `main` redeploys automatically —
`npm run build` runs `prisma migrate deploy` first, so schema changes ship
with the code that needs them.

To set this up again from scratch on a new project:

```bash
npx vercel login
npx vercel link --yes
npx vercel blob create-store <name> --access public --yes
npx vercel integration add neon   # first run prints a terms-acceptance URL;
                                   # open it, accept, then re-run this command
npx vercel env add AUTH_SECRET production   # repeat per env var, per environment
```

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
