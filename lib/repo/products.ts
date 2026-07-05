import { unstable_cache } from "next/cache";
import { sql } from "../db";
import type { Product } from "../types";

/**
 * Tag applied to every cached product read. Any route that mutates products
 * (or product stock) calls `revalidateTag(PRODUCTS_TAG)` so the storefront
 * picks up the change instead of serving a stale cache. Reads are cached
 * because the Neon database is remote (~0.5–2s per uncached query).
 */
export const PRODUCTS_TAG = "products";
const CACHE_TTL_SECONDS = 3600;

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  price: string;
  originalPrice: string | null;
  image: string;
  categoryId: string;
  categoryName: string | null;
  badge: string | null;
  stock: number;
  featured: boolean;
  createdAt: string;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    details: row.details || undefined,
    price: Number(row.price),
    originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
    image: row.image,
    categoryId: row.categoryId,
    categoryName: row.categoryName ?? undefined,
    badge: row.badge ?? undefined,
    stock: row.stock,
    featured: row.featured,
    createdAt: row.createdAt,
  };
}

async function selectProducts(filters?: {
  categoryId?: string;
  featured?: boolean;
}): Promise<Product[]> {
  let result;

  if (filters?.categoryId && filters?.featured !== undefined) {
    result = await sql`
      SELECT id, name, slug, description, details, price, "originalPrice", image,
             "categoryId", "categoryName", badge, stock, featured, "createdAt"
      FROM products
      WHERE "categoryId" = ${filters.categoryId} AND featured = ${filters.featured}
      ORDER BY "createdAt" DESC
    `;
  } else if (filters?.categoryId) {
    result = await sql`
      SELECT id, name, slug, description, details, price, "originalPrice", image,
             "categoryId", "categoryName", badge, stock, featured, "createdAt"
      FROM products
      WHERE "categoryId" = ${filters.categoryId}
      ORDER BY "createdAt" DESC
    `;
  } else if (filters?.featured !== undefined) {
    result = await sql`
      SELECT id, name, slug, description, details, price, "originalPrice", image,
             "categoryId", "categoryName", badge, stock, featured, "createdAt"
      FROM products
      WHERE featured = ${filters.featured}
      ORDER BY "createdAt" DESC
    `;
  } else {
    result = await sql`
      SELECT id, name, slug, description, details, price, "originalPrice", image,
             "categoryId", "categoryName", badge, stock, featured, "createdAt"
      FROM products
      ORDER BY "createdAt" DESC
    `;
  }

  return (result.rows as ProductRow[]).map(toProduct);
}

/** Cached product listing. Invalidated via `revalidateTag(PRODUCTS_TAG)`. */
export const listProducts = unstable_cache(selectProducts, ["list-products"], {
  tags: [PRODUCTS_TAG],
  revalidate: CACHE_TTL_SECONDS,
});

async function selectProductById(id: string): Promise<Product | undefined> {
  const { rows } = await sql`
    SELECT id, name, slug, description, details, price, "originalPrice", image,
           "categoryId", "categoryName", badge, stock, featured, "createdAt"
    FROM products WHERE id = ${id}
  `;
  return rows[0] ? toProduct(rows[0] as ProductRow) : undefined;
}

/** Cached single-product read for storefront pages. */
export const findProductById = unstable_cache(
  selectProductById,
  ["product-by-id"],
  { tags: [PRODUCTS_TAG], revalidate: CACHE_TTL_SECONDS },
);

/**
 * Uncached single-product read. Use for correctness-critical paths (checkout
 * stock checks, admin edits) where a stale snapshot must not be trusted.
 */
export function findProductByIdFresh(
  id: string,
): Promise<Product | undefined> {
  return selectProductById(id);
}

export async function findProductsByIds(ids: string[]): Promise<Product[]> {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return [];
  const found = await Promise.all(unique.map((id) => findProductById(id)));
  return found.filter((p): p is Product => p !== undefined);
}

export async function createProduct(p: Product): Promise<Product> {
  await sql`
    INSERT INTO products (id, name, slug, description, details, price, "originalPrice", image,
                          "categoryId", "categoryName", badge, stock, featured, "createdAt")
    VALUES (${p.id}, ${p.name}, ${p.slug}, ${p.description}, ${p.details ?? ""},
            ${p.price}, ${p.originalPrice ?? null}, ${p.image}, ${p.categoryId},
            ${p.categoryName ?? null}, ${p.badge ?? null}, ${p.stock}, ${p.featured},
            ${p.createdAt})
  `;
  return p;
}

export async function updateProductById(
  id: string,
  patch: Partial<Product>,
): Promise<Product | undefined> {
  const existing = await selectProductById(id);
  if (!existing) return undefined;
  const next: Product = { ...existing, ...patch };

  await sql`
    UPDATE products SET
      name = ${next.name}, slug = ${next.slug}, description = ${next.description},
      details = ${next.details ?? ""}, price = ${next.price},
      "originalPrice" = ${next.originalPrice ?? null}, image = ${next.image},
      "categoryId" = ${next.categoryId}, "categoryName" = ${next.categoryName ?? null},
      badge = ${next.badge ?? null}, stock = ${next.stock}, featured = ${next.featured}
    WHERE id = ${id}
  `;

  return next;
}

export async function deleteProductById(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM products WHERE id = ${id}`;
  return (result.rowCount ?? 0) > 0;
}
