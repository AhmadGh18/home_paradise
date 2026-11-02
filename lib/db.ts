import {
  db as hostedDb,
  sql as hostedSql,
  type VercelPoolClient,
} from "@vercel/postgres";
import { isLocalDatabaseUrl, localDb, localSql } from "./db-local";

const useLocalDb = isLocalDatabaseUrl(process.env.POSTGRES_URL);

export const sql = (useLocalDb ? localSql : hostedSql) as typeof hostedSql;
const db = (useLocalDb ? localDb : hostedDb) as typeof hostedDb;

/** Runs `fn` in a transaction on one connection; any throw rolls it all back. */
export async function withTransaction<T>(
  fn: (tx: VercelPoolClient) => Promise<T>,
): Promise<T> {
  const client = await db.connect();
  let brokenConnection: Error | undefined;
  try {
    await client.sql`BEGIN`;
    const result = await fn(client);
    await client.sql`COMMIT`;
    return result;
  } catch (err) {
    try {
      await client.sql`ROLLBACK`;
    } catch (rollbackErr) {
      // Don't hand a connection with an open transaction back to the pool.
      brokenConnection = rollbackErr as Error;
    }
    throw err;
  } finally {
    client.release(brokenConnection);
  }
}

export function createRateLimitsTable() {
  return sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key      TEXT PRIMARY KEY,
      count    INTEGER NOT NULL,
      reset_at TIMESTAMPTZ NOT NULL
    )
  `;
}

/** Creates or upgrades the schema. Safe to run repeatedly (`npm run db:migrate`). */
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

  await createRateLimitsTable();

  await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId")`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders("createdAt")`;

  // Last line of defence against negative stock or prices. NOT VALID applies
  // the rule to new writes without failing on any existing rows.
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_stock_non_negative') THEN
        ALTER TABLE products ADD CONSTRAINT products_stock_non_negative CHECK (stock >= 0) NOT VALID;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_price_non_negative') THEN
        ALTER TABLE products ADD CONSTRAINT products_price_non_negative CHECK (price >= 0) NOT VALID;
      END IF;
    END $$
  `;
}
