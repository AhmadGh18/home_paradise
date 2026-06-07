import path from "node:path";
import Database, { type Database as DB } from "better-sqlite3";

declare global {
  var __hp_db: DB | undefined;
}

function openDatabase(): DB {
  const file =
    process.env.DATABASE_FILE ??
    path.join(process.cwd(), "data.sqlite");

  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

function migrate(db: DB) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      slug        TEXT NOT NULL UNIQUE,
      image       TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS products (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      slug          TEXT NOT NULL UNIQUE,
      description   TEXT NOT NULL DEFAULT '',
      details       TEXT NOT NULL DEFAULT '',
      price         REAL NOT NULL,
      originalPrice REAL,
      image         TEXT NOT NULL DEFAULT '',
      categoryId    TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      categoryName  TEXT,
      badge         TEXT,
      stock         INTEGER NOT NULL DEFAULT 0,
      featured      INTEGER NOT NULL DEFAULT 0,
      createdAt     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id            TEXT PRIMARY KEY,
      customerName  TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      address       TEXT NOT NULL DEFAULT '',
      items         TEXT NOT NULL,
      total         REAL NOT NULL,
      status        TEXT NOT NULL CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
      createdAt     TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(categoryId);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_orders_status    ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created   ON orders(createdAt);
  `);
}

export function getDb(): DB {
  if (!globalThis.__hp_db) globalThis.__hp_db = openDatabase();
  return globalThis.__hp_db;
}
