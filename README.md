# HomeParadise

A Next.js + Postgres (Neon / Vercel Postgres) storefront with a protected admin panel.

## Getting started

```bash
npm install
cp .env.example .env.local       # then fill in every value
npm run db:migrate               # create or upgrade the schema
npm run dev
```

Open <http://localhost:3000>. The admin panel is at <http://localhost:3000/admin>.

To add sample data to a development database, run `npm run db:seed`. It includes a
fake order, so don't run it against production.

### Local database

To develop without a hosted database, set this in `.env.local`:

```
POSTGRES_URL=postgres://local:local@localhost:5433/hompar
```

Then keep `npm run db:local` running in one terminal. On the first run, also run
`npm run db:migrate` and `npm run db:seed`. Start the app with `npm run dev` in another
terminal. Data is stored in `.localdb/`, which git ignores.

## Environment variables

| Name             | Required | Description                                                    |
| ---------------- | -------- | -------------------------------------------------------------- |
| `ADMIN_USERNAME` | yes      | Admin login username.                                          |
| `ADMIN_PASSWORD` | yes      | Admin login password. Use a long, unique one.                  |
| `SESSION_SECRET` | yes      | Random string used to HMAC-sign session cookies (>= 16 chars). |
| `POSTGRES_URL`   | yes      | Pooled Postgres connection string.                             |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Real values belong in `.env.local` (ignored by git) and your host's settings, never in
`.env.example`.

## Project layout

```
app/
  api/                    REST endpoints (products, orders, categories, auth)
  admin/                  Admin panel
    login/                Public login page
    (panel)/              Protected dashboard, products, orders
  ...                     Public storefront routes
lib/
  db.ts                   Postgres connection, transactions and schema
  migrate.ts              Schema runner (`npm run db:migrate`)
  seed.ts                 Idempotent sample data (`npm run db:seed`)
  api.ts                  Route wrapper, errors, body and upload parsing
  validation.ts           Input rules for products and orders
  rate-limit.ts           Postgres-backed per-client rate limits
  auth/
    session.ts            HMAC-signed session cookies
    admin.ts              `requireAdmin()` + credential check
  repo/                   Typed data access
proxy.ts                  Server-side guard for /admin/*
```

## Security model

- `proxy.ts` guards every `/admin/*` page. API routes aren't covered by it, so each
  admin endpoint calls `requireAdmin()`, which returns `401` without a valid session.
- Wrap every API handler in `route()` from `lib/api.ts`. It rejects cross-origin writes
  and stops internal errors from reaching clients.
- Session cookies are signed with `SESSION_SECRET` and the admin login details, expire
  after 12 hours, and are `httpOnly` + `sameSite=strict`. They are stateless: logging out
  clears the cookie in that browser, and changing the admin password or `SESSION_SECRET`
  ends every session at once.
- Login allows 5 attempts per client and 100 in total, and orders allow 10 per client,
  all per 15 minutes. Per-client limits rely on `x-forwarded-for`, which Vercel sets. If
  you self-host, your reverse proxy must overwrite that header, or clients can bypass
  those limits. The total login limit still applies.

## Orders and stock

Placing an order reads prices from the database and takes stock in a single transaction,
so totals can't be forged and products can't oversell. Cancelling an order returns its
items to stock, and un-cancelling takes them out again if enough remain.

## Images

Uploads must be real JPEG, PNG, WebP or GIF files up to 2 MB. They are stored in the
database and served from `/api/products/[id]/image/[version]`. Image URLs must use a host
listed in both `IMAGE_HOSTS` (`lib/validation.ts`) and `images.remotePatterns`
(`next.config.ts`).
