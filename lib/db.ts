import { sql } from "@vercel/postgres";

export { sql };

export async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      slug        TEXT NOT NULL UNIQUE,
      image       TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      slug          TEXT NOT NULL UNIQUE,
      description   TEXT NOT NULL DEFAULT '',
      details       TEXT NOT NULL DEFAULT '',
      price         NUMERIC NOT NULL,
      "originalPrice" NUMERIC,
      image         TEXT NOT NULL DEFAULT '',
      "categoryId"  TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      "categoryName" TEXT,
      badge         TEXT,
      stock         INTEGER NOT NULL DEFAULT 0,
      featured      BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt"   TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id              TEXT PRIMARY KEY,
      "customerName"  TEXT NOT NULL,
      "customerEmail" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      address         TEXT NOT NULL DEFAULT '',
      items           TEXT NOT NULL,
      total           NUMERIC NOT NULL,
      status          TEXT NOT NULL CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
      "createdAt"     TEXT NOT NULL
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId")`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders("createdAt")`;
}
