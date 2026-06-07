import { getDb } from "./db";
import type { Category, Product, Order } from "./types";

const SEED_CATEGORIES: Category[] = [
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

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Pink Peony Bouquet",
    slug: "pink-peony-bouquet",
    description: "Seasonal garden peonies wrapped in linen.",
    details:
      "Our signature Pink Peony Bouquet features hand-picked seasonal garden peonies carefully wrapped in natural linen. Each bouquet contains 10–12 blooms and includes a personalised note card.",
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
  {
    id: "prod-2",
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    description: "Glossy split-leaf statement plant in a terracotta pot.",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-2",
    categoryName: "Plants",
    stock: 10,
    featured: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "prod-3",
    name: "Lavender Oat Soap",
    slug: "lavender-oat-soap",
    description: "Cold-pressed lavender soap with rolled oats.",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-3",
    categoryName: "Soaps",
    stock: 40,
    featured: false,
    createdAt: "2026-02-01T10:00:00Z",
  },
];

const SEED_ORDERS: Order[] = [
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
];

export function seed() {
  const db = getDb();
  const tx = db.transaction(() => {
    const insertCategory = db.prepare(
      "INSERT OR IGNORE INTO categories (id,name,slug,image,description) VALUES (@id,@name,@slug,@image,@description)",
    );
    for (const c of SEED_CATEGORIES) insertCategory.run(c);

    const insertProduct = db.prepare(
      `INSERT OR IGNORE INTO products
         (id,name,slug,description,details,price,originalPrice,image,categoryId,categoryName,badge,stock,featured,createdAt)
       VALUES
         (@id,@name,@slug,@description,@details,@price,@originalPrice,@image,@categoryId,@categoryName,@badge,@stock,@featured,@createdAt)`,
    );
    for (const p of SEED_PRODUCTS)
      insertProduct.run({
        ...p,
        details: p.details ?? "",
        originalPrice: p.originalPrice ?? null,
        categoryName: p.categoryName ?? null,
        badge: p.badge ?? null,
        featured: p.featured ? 1 : 0,
      });

    const insertOrder = db.prepare(
      `INSERT OR IGNORE INTO orders
         (id,customerName,customerEmail,customerPhone,address,items,total,status,createdAt)
       VALUES
         (@id,@customerName,@customerEmail,@customerPhone,@address,@items,@total,@status,@createdAt)`,
    );
    for (const o of SEED_ORDERS)
      insertOrder.run({ ...o, items: JSON.stringify(o.items) });
  });
  tx();
}

if (require.main === module) {
  seed();
  console.log("Database seeded.");
}
