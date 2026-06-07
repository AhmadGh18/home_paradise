# HomeParadise

A Next.js + SQLite storefront with a protected admin panel.

## Getting started

```bash
npm install
cp .env.example .env.local       # then edit ADMIN_PASSWORD & SESSION_SECRET
npm run dev
```

Open <http://localhost:3000>. The admin panel is at <http://localhost:3000/admin>.

## Environment variables

| Name             | Required | Description                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------ |
| `ADMIN_USERNAME` | yes      | Admin login username.                                                    |
| `ADMIN_PASSWORD` | yes      | Admin login password.                                                    |
| `SESSION_SECRET` | yes      | Random string used to HMAC-sign session cookies (>= 16 chars).           |
| `DATABASE_FILE`  | no       | Path to the SQLite file. Defaults to `./data.sqlite`.                    |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Project layout

```
app/
  api/                    REST endpoints (products, orders, categories, auth)
  admin/                  Admin panel
    login/                Public login page
    (panel)/              Protected dashboard, products, orders
  ...                     Public storefront routes
lib/
  db.ts                   SQLite connection + migrations
  seed.ts                 Idempotent seed data (run with `npm run db:seed`)
  api.ts                  Response & body-parsing helpers
  auth/
    session.ts            HMAC-signed session cookies (Edge-safe)
    admin.ts              `requireAdmin()` + credential check
  repo/                   Typed CRUD wrappers around the database
proxy.ts                  Server-side guard for /admin/*
```

## Database

Schema is created on first connection and is safe to run repeatedly. To
populate sample data:

```bash
npm run db:seed
```

## Auth model

* Login is enforced by `proxy.ts` for every `/admin/*` route.
* Mutating API endpoints (`POST/PUT/PATCH/DELETE`) call `requireAdmin()` which
  rejects unauthenticated requests with `401`.
* Session cookies are HMAC-SHA-256 signed with `SESSION_SECRET`, expire after
  24 hours, and are `httpOnly` + `sameSite=lax`.
