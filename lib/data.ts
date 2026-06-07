import type { Category, Product, Order } from "./types";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedCategories: Category[] = [
  {
    id: "cat-1",
    name: "Flowers",
    slug: "flowers",
    image:
      "https://images.unsplash.com/photo-1587653263995-422546a7a569?auto=format&fit=crop&w=900&q=80",
    description: "Fresh-cut seasonal blooms",
  },
  {
    id: "cat-2",
    name: "Plants",
    slug: "plants",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=80",
    description: "Indoor & outdoor greenery",
  },
  {
    id: "cat-3",
    name: "Soaps",
    slug: "soaps",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=80",
    description: "Handcrafted artisan soaps",
  },
  {
    id: "cat-4",
    name: "Gifts",
    slug: "gifts",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
    description: "Curated gift sets",
  },
];

const seedProducts: Product[] = [
  {
    id: "prod-1",
    name: "Pink Peony Bouquet",
    slug: "pink-peony-bouquet",
    description: "Seasonal garden peonies wrapped in linen.",
    details:
      "Our signature Pink Peony Bouquet features hand-picked seasonal garden peonies carefully wrapped in natural linen. Each bouquet contains 10–12 blooms and includes a personalised note card. Best placed in a cool room with fresh water changed every two days.",
    price: 48,
    originalPrice: 62,
    image:
      "https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-1",
    categoryName: "Flowers",
    badge: "New",
    stock: 15,
    featured: true,
    createdAt: "2026-01-10T10:00:00Z",
  },
];

const seedOrders: Order[] = [
  {
    id: "ord-1",
    customerName: "Amelia K.",
    customerPhone: "+96181501749",
    customerEmail: "amelia@example.com",
    address: "12 Garden Lane, London, E1 4BR",
    items: [
      {
        productId: "prod-2",
        productName: "Monstera Deliciosa",
        price: 36,
        quantity: 1,
      },
    ],
    total: 36,
    status: "delivered",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "ord-2",
    customerName: "Daniel R.",
    customerPhone: "+96181501749",

    customerEmail: "daniel@example.com",
    address: "7 Bloom Street, Bristol, BS1 2AB",
    items: [
      {
        productId: "prod-3",
        productName: "Lavender Oat Soap",
        price: 14,
        quantity: 3,
      },
    ],
    total: 42,
    status: "processing",
    createdAt: "2026-04-01T11:00:00Z",
  },
  {
    id: "ord-3",
    customerName: "Priya S.",
    customerEmail: "priya@example.com",
    customerPhone: "+96181501749",

    address: "44 Petal Road, Edinburgh, EH1 1AA",
    items: [
      {
        productId: "prod-6",
        productName: "Eucalyptus Bundle",
        price: 18,
        quantity: 1,
      },
      {
        productId: "prod-9",
        productName: "Spring Gift Box",
        price: 55,
        quantity: 1,
      },
    ],
    total: 73,
    status: "shipped",
    createdAt: "2026-04-20T14:00:00Z",
  },
];

// ─── Singleton Store ──────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __hp_store:
    | { categories: Category[]; products: Product[]; orders: Order[] }
    | undefined;
}

if (!globalThis.__hp_store) {
  globalThis.__hp_store = {
    categories: [...seedCategories],
    products: [...seedProducts],
    orders: [...seedOrders],
  };
}

export const db = globalThis.__hp_store!;

// Determine whether to use SQLite (when env var set)
const useSqlite = Boolean(process.env.USE_SQLITE || process.env.SQLITE_DB_PATH);
let sql: any = null;

if (useSqlite) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require("better-sqlite3");
    const dbPath = process.env.SQLITE_DB_PATH || "./data.sqlite";
    sql = new Database(dbPath);

    // Create tables
    sql.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY, name TEXT, slug TEXT, image TEXT, description TEXT
      );
    `);

    sql.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        slug TEXT,
        description TEXT,
        details TEXT,
        price REAL,
        originalPrice REAL,
        image TEXT,
        categoryId TEXT,
        categoryName TEXT,
        badge TEXT,
        stock INTEGER,
        featured INTEGER,
        createdAt TEXT
      );
    `);

    sql.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT,
        customerEmail TEXT,
        customerPhone TEXT,
        address TEXT,
        items TEXT,
        total REAL,
        status TEXT,
        createdAt TEXT
      );
    `);

    // seed if empty
    const pCount = sql.prepare("SELECT COUNT(*) as c FROM products").get().c;
    if (pCount === 0) {
      const insert = sql.prepare(
        `INSERT INTO products (id,name,slug,description,details,price,originalPrice,image,categoryId,categoryName,badge,stock,featured,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      );
      const insertMany = sql.transaction((rows: Product[]) => {
        for (const r of rows) {
          insert.run(
            r.id,
            r.name,
            r.slug,
            r.description,
            r.details ?? "",
            r.price,
            r.originalPrice ?? null,
            r.image ?? "",
            r.categoryId,
            r.categoryName ?? "",
            r.badge ?? null,
            r.stock,
            r.featured ? 1 : 0,
            r.createdAt,
          );
        }
      });
      insertMany(seedProducts);
    }

    const cCount = sql.prepare("SELECT COUNT(*) as c FROM categories").get().c;
    if (cCount === 0) {
      const insertC = sql.prepare(
        "INSERT INTO categories (id,name,slug,image,description) VALUES (?,?,?,?,?)",
      );
      const insertManyC = sql.transaction((rows: Category[]) => {
        for (const r of rows)
          insertC.run(r.id, r.name, r.slug, r.image, r.description);
      });
      insertManyC(seedCategories);
    }

    const oCount = sql.prepare("SELECT COUNT(*) as c FROM orders").get().c;
    if (oCount === 0) {
      const insertO = sql.prepare(
        "INSERT INTO orders (id,customerName,customerEmail,customerPhone,address,items,total,status,createdAt) VALUES (?,?,?,?,?,?,?,?,?)",
      );
      const insertManyO = sql.transaction((rows: Order[]) => {
        for (const r of rows)
          insertO.run(
            r.id,
            r.customerName,
            r.customerEmail,
            r.customerPhone,
            r.address,
            JSON.stringify(r.items),
            r.total,
            r.status,
            r.createdAt,
          );
      });
      insertManyO(seedOrders);
    }
  } catch (e) {
    // If sqlite not available, fallback to in-memory
    sql = null;
    // eslint-disable-next-line no-console
    console.warn(
      "SQLite initialization failed, falling back to in-memory store.",
      e instanceof Error ? e.message : String(e),
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    details: row.details || undefined,
    price: Number(row.price),
    originalPrice:
      row.originalPrice !== null ? Number(row.originalPrice) : undefined,
    image: row.image ?? "",
    categoryId: row.categoryId,
    categoryName: row.categoryName || undefined,
    badge: row.badge || undefined,
    stock: Number(row.stock),
    featured: Boolean(row.featured),
    createdAt: row.createdAt,
  };
}

export const getProducts = () => {
  if (sql) {
    return sql
      .prepare("SELECT * FROM products ORDER BY createdAt DESC")
      .all()
      .map(rowToProduct);
  }
  return db.products;
};

export const getFeaturedProducts = () => {
  if (sql) {
    return sql
      .prepare("SELECT * FROM products WHERE featured = 1")
      .all()
      .map(rowToProduct);
  }
  return db.products.filter((p) => p.featured);
};

export const getProductById = (id: string) => {
  if (sql) {
    const row = sql.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return row ? rowToProduct(row) : undefined;
  }
  return db.products.find((p) => p.id === id);
};

export const getProductBySlug = (slug: string) => {
  if (sql) {
    const row = sql.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
    return row ? rowToProduct(row) : undefined;
  }
  return db.products.find((p) => p.slug === slug);
};

export const getCategories = () => {
  if (sql) return sql.prepare("SELECT * FROM categories").all();
  return db.categories;
};

export const getCategoryById = (id: string) => {
  if (sql) return sql.prepare("SELECT * FROM categories WHERE id = ?").get(id);
  return db.categories.find((c) => c.id === id);
};

export const getOrders = () => {
  if (sql)
    return sql
      .prepare("SELECT * FROM orders")
      .all()
      .map((r: any) => ({ ...r, items: JSON.parse(r.items) }));
  return db.orders;
};

export const getOrderById = (id: string) => {
  if (sql) {
    const row = sql.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    if (!row) return undefined;
    return { ...row, items: JSON.parse(row.items) } as Order;
  }
  return db.orders.find((o) => o.id === id);
};

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const addProduct = (p: Product) => {
  if (sql) {
    const stmt = sql.prepare(
      "INSERT INTO products (id,name,slug,description,details,price,originalPrice,image,categoryId,categoryName,badge,stock,featured,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    );
    stmt.run(
      p.id,
      p.name,
      p.slug,
      p.description,
      p.details ?? "",
      p.price,
      p.originalPrice ?? null,
      p.image ?? "",
      p.categoryId,
      p.categoryName ?? null,
      p.badge ?? null,
      p.stock,
      p.featured ? 1 : 0,
      p.createdAt,
    );
    return p;
  }
  db.products.push(p);
  return p;
};

export const updateProduct = (id: string, fields: Partial<Product>) => {
  if (sql) {
    const existing = getProductById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...fields } as Product;
    const stmt = sql.prepare(
      "UPDATE products SET name=?,slug=?,description=?,details=?,price=?,originalPrice=?,image=?,categoryId=?,categoryName=?,badge=?,stock=?,featured=? WHERE id=?",
    );
    stmt.run(
      updated.name,
      updated.slug,
      updated.description,
      updated.details ?? "",
      updated.price,
      updated.originalPrice ?? null,
      updated.image ?? "",
      updated.categoryId,
      updated.categoryName ?? null,
      updated.badge ?? null,
      updated.stock,
      updated.featured ? 1 : 0,
      id,
    );
    return updated;
  }
  const idx = db.products.findIndex((x) => x.id === id);
  if (idx === -1) return undefined;
  db.products[idx] = { ...db.products[idx], ...fields } as Product;
  return db.products[idx];
};

export const deleteProduct = (id: string) => {
  if (sql) {
    const stmt = sql.prepare("DELETE FROM products WHERE id = ?");
    stmt.run(id);
    return true;
  }
  const idx = db.products.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  db.products.splice(idx, 1);
  return true;
};

export const updateOrderStatus = (id: string, status: Order["status"]) => {
  if (sql) {
    const stmt = sql.prepare("UPDATE orders SET status = ? WHERE id = ?");
    stmt.run(status, id);
    const row = sql.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    if (!row) return undefined;
    return { ...row, items: JSON.parse(row.items) } as Order;
  }
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  db.orders[idx] = { ...db.orders[idx], status };
  return db.orders[idx];
};

export const addOrder = (o: Order) => {
  if (sql) {
    const stmt = sql.prepare(
      "INSERT INTO orders (id,customerName,customerEmail,customerPhone,address,items,total,status,createdAt) VALUES (?,?,?,?,?,?,?,?,?)",
    );
    stmt.run(
      o.id,
      o.customerName,
      o.customerEmail,
      o.customerPhone,
      o.address,
      JSON.stringify(o.items),
      o.total,
      o.status,
      o.createdAt,
    );
    return o;
  }
  db.orders.push(o);
  return o;
};
