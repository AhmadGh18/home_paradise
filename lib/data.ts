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

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getProducts = () => db.products;
export const getFeaturedProducts = () => db.products.filter((p) => p.featured);
export const getProductById = (id: string) =>
  db.products.find((p) => p.id === id);
export const getProductBySlug = (slug: string) =>
  db.products.find((p) => p.slug === slug);

export const getCategories = () => db.categories;
export const getCategoryById = (id: string) =>
  db.categories.find((c) => c.id === id);

export const getOrders = () => db.orders;
export const getOrderById = (id: string) => db.orders.find((o) => o.id === id);

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
