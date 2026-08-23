# Thato Junior Maluleka — Portfolio of Evidence

A full-stack portfolio: the public site, and a `/dashboard` behind it for
adding projects and events without touching code.

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Prisma ·
Auth.js (single-admin credentials login) · Tailwind CSS v4 · Framer Motion ·
Vercel Blob (production image uploads).

## Local development

No external accounts needed — everything runs against a local SQLite file
and saves uploaded images under `/public/uploads`.

```bash
npm install
npm run db:migrate   # creates prisma/dev.db and applies the schema
npm run dev
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

1. **Database:** create a free [Neon](https://neon.tech) Postgres database
   (or add it from the Vercel dashboard's Storage tab — it auto-fills
   `DATABASE_URL`). Then in `prisma/schema.prisma`, change:

   ```diff
   - provider = "sqlite"
   + provider = "postgresql"
   ```

   and run `npx prisma migrate deploy` once against the new `DATABASE_URL`.
2. **Images:** enable Vercel Blob (Vercel dashboard → Storage → Blob →
   Connect to Project) — this auto-injects `BLOB_READ_WRITE_TOKEN`. Once
   set, uploads go to Blob instead of the local filesystem automatically
   (serverless functions can't write to disk persistently).
3. **Env vars:** set `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` in
   the Vercel project settings (values from `.env.local`, but paste the
   **unescaped** hash here — Vercel's UI isn't a dotenv parser).
4. Push to `main` / connect the repo in Vercel and deploy.

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
