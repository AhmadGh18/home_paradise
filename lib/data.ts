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
  {
    id: "prod-2",
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    description: "Statement greenery in a terracotta pot.",
    details:
      "The iconic Monstera Deliciosa, housed in a handmade terracotta pot. Approximately 60 cm tall with well-established roots and 6–8 mature leaves. Ideal for bright indirect light. Ships with detailed care instructions.",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-2",
    categoryName: "Plants",
    stock: 8,
    featured: true,
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "prod-3",
    name: "Lavender Oat Soap",
    slug: "lavender-oat-soap",
    description: "Small-batch bar with French lavender.",
    details:
      "Cold-processed soap bar made with French lavender essential oil, colloidal oatmeal, and shea butter. 120 g bar. Handmade in small batches of 20. Naturally scented — no artificial fragrances. Suitable for sensitive skin.",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-3",
    categoryName: "Soaps",
    badge: "Bestseller",
    stock: 42,
    featured: true,
    createdAt: "2026-01-14T10:00:00Z",
  },
  {
    id: "prod-4",
    name: "Pampas Grass Bundle",
    slug: "pampas-grass-bundle",
    description: "Dried blooms in muted natural tones.",
    details:
      "A bundle of 5 dried pampas grass plumes in a mix of natural ivory and blush tones. Carefully dried and treated to ensure longevity. Arrange in a floor vase or use as a table centrepiece.",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-1",
    categoryName: "Flowers",
    stock: 20,
    featured: true,
    createdAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "prod-5",
    name: "Mini Succulent Trio",
    slug: "mini-succulent-trio",
    description: "Three low-maintenance desert gems.",
    details:
      "Three hand-selected succulents, each in its own ceramic pot. Varieties change seasonally but are always chosen for visual harmony. Ideal for windowsills, desks, and shelves. Water once every 2 weeks.",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1502809522503-b5c5d40d9f36?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-2",
    categoryName: "Plants",
    stock: 25,
    featured: true,
    createdAt: "2026-01-18T10:00:00Z",
  },
  {
    id: "prod-6",
    name: "Eucalyptus Bundle",
    slug: "eucalyptus-bundle",
    description: "Fresh-cut aromatic stems, wrapped.",
    details:
      "A generous bundle of fresh-cut eucalyptus stems wrapped in recycled kraft paper with a linen ribbon. Wonderfully fragrant — hang in your shower to release the natural oils with steam. Lasts 2–3 weeks.",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1524598171353-ce84a56167a3?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-1",
    categoryName: "Flowers",
    badge: "Limited",
    stock: 10,
    featured: true,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "prod-7",
    name: "Botanical Soap Set",
    slug: "botanical-soap-set",
    description: "Four bars — rose, mint, sage, honey.",
    details:
      "A gift-ready set of four artisan soap bars: Rose & Geranium, Peppermint & Charcoal, Wild Sage, and Raw Honey & Oat. Each bar is 120 g, cold-processed and wrapped in hand-stamped paper. Packaged in a recycled kraft box.",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1615486511484-80bd37c2d4fa?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-3",
    categoryName: "Soaps",
    stock: 18,
    featured: false,
    createdAt: "2026-01-22T10:00:00Z",
  },
  {
    id: "prod-8",
    name: "Fiddle Leaf Fig",
    slug: "fiddle-leaf-fig",
    description: "Sculptural floor plant, 3 ft tall.",
    details:
      "A mature Fiddle Leaf Fig (Ficus lyrata) approximately 90 cm tall, growing in a hand-thrown ceramic pot. Loves bright, indirect light and consistent watering. Our horticulturist checks each specimen before dispatch.",
    price: 84,
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-2",
    categoryName: "Plants",
    stock: 5,
    featured: false,
    createdAt: "2026-01-24T10:00:00Z",
  },
  {
    id: "prod-9",
    name: "Spring Gift Box",
    slug: "spring-gift-box",
    description: "A seasonal curation for someone special.",
    details:
      "Includes one Lavender Oat Soap, a Mini Succulent, a packet of wildflower seeds, and a handwritten gift note. Beautifully packaged in a sustainable kraft box with dried flower accents.",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-4",
    categoryName: "Gifts",
    badge: "New",
    stock: 12,
    featured: false,
    createdAt: "2026-01-26T10:00:00Z",
  },
  {
    id: "prod-10",
    name: "Rose & Chamomile Soap",
    slug: "rose-chamomile-soap",
    description: "Gentle bar with Bulgarian rose oil.",
    details:
      "Made with Bulgarian rose absolute and chamomile extract. Ideal for dry or sensitive skin. 120 g bar, cold-processed with coconut oil and shea butter base.",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1616604426205-b8a85bb7f042?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-3",
    categoryName: "Soaps",
    stock: 30,
    featured: false,
    createdAt: "2026-01-28T10:00:00Z",
  },
  {
    id: "prod-11",
    name: "Pothos Hanger",
    slug: "pothos-hanger",
    description: "Trailing greenery with macramé hanger.",
    details:
      "A lush Golden Pothos in a handmade macramé hanger crafted from natural cotton rope. The trailing vines can reach up to 2 m. Thrives in low to bright indirect light.",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-2",
    categoryName: "Plants",
    stock: 14,
    featured: false,
    createdAt: "2026-01-30T10:00:00Z",
  },
  {
    id: "prod-12",
    name: "Wildflower Bouquet",
    slug: "wildflower-bouquet",
    description: "A meadow of colour, hand-tied.",
    details:
      "A joyful mix of seasonal wildflowers — cornflowers, daisies, sweet peas, and more — hand-tied with twine. Changes weekly based on what's at its peak.",
    price: 34,
    image:
      "https://images.unsplash.com/photo-1490750967868-88df5691cc9c?auto=format&fit=crop&w=700&q=80",
    categoryId: "cat-1",
    categoryName: "Flowers",
    stock: 20,
    featured: false,
    createdAt: "2026-02-01T10:00:00Z",
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
