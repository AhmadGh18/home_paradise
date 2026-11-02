import { revalidateTag, unstable_cache } from "next/cache";
import { sql } from "../db";
import type { Product } from "../types";
import type { ProductPatch } from "../validation";

/**
 * Tag applied to every cached product read. Reads are cached because the Neon
 * database is remote (~0.5–2s per uncached query).
 */
const PRODUCTS_TAG = "products";
const CACHE_TTL_SECONDS = 3600;

/**
 * Expires cached products immediately, so an admin reloading the list sees
 * their edit and shoppers see current stock. The "max" profile would keep
 * serving the old data to the next visitor while it refreshed in the background.
 */
export function invalidateProducts() {
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
}

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

// Uploaded images are stored as data URLs, which are far too big to send with
// every product. Each query below returns a link to the image route instead,
// including a hash of the image so the URL changes when the image does.

async function selectProducts(filters?: {
  categoryId?: string;
  featured?: boolean;
}): Promise<Product[]> {
  const categoryId = filters?.categoryId ?? null;
  const featured = filters?.featured ?? null;
  const { rows } = await sql`
    SELECT id, name, slug, description, details, price, "originalPrice",
           CASE WHEN image LIKE 'data:%'
                THEN '/api/products/' || id || '/image/' || left(md5(image), 12)
                ELSE image END AS image,
           "categoryId", "categoryName", badge, stock, featured, "createdAt"
    FROM products
    WHERE (${categoryId}::text IS NULL OR "categoryId" = ${categoryId})
      AND (${featured}::boolean IS NULL OR featured = ${featured})
    ORDER BY "createdAt" DESC
  `;
  return (rows as ProductRow[]).map(toProduct);
}

/** Cached product listing. Invalidated via `invalidateProducts()`. */
export const listProducts = unstable_cache(selectProducts, ["list-products"], {
  tags: [PRODUCTS_TAG],
  revalidate: CACHE_TTL_SECONDS,
});

async function selectProductById(id: string): Promise<Product | undefined> {
  const { rows } = await sql`
    SELECT id, name, slug, description, details, price, "originalPrice",
           CASE WHEN image LIKE 'data:%'
                THEN '/api/products/' || id || '/image/' || left(md5(image), 12)
                ELSE image END AS image,
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

/** Uncached single-product read, for admin edits. */
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

/** The raw stored image, plus the short hash used in its URL. */
export async function findProductImage(
  id: string,
): Promise<{ image: string; version: string } | undefined> {
  const { rows } = await sql`
    SELECT image, left(md5(image), 12) AS version FROM products WHERE id = ${id}
  `;
  return rows[0] as { image: string; version: string } | undefined;
}

export async function createProduct(p: Product): Promise<Product> {
  const { rows } = await sql`
    INSERT INTO products (id, name, slug, description, details, price, "originalPrice", image,
                          "categoryId", "categoryName", badge, stock, featured, "createdAt")
    VALUES (${p.id}, ${p.name}, ${p.slug}, ${p.description}, ${p.details ?? ""},
            ${p.price}, ${p.originalPrice ?? null}, ${p.image}, ${p.categoryId},
            ${p.categoryName ?? null}, ${p.badge ?? null}, ${p.stock}, ${p.featured},
            ${p.createdAt})
    RETURNING id, name, slug, description, details, price, "originalPrice",
              CASE WHEN image LIKE 'data:%'
                   THEN '/api/products/' || id || '/image/' || left(md5(image), 12)
                   ELSE image END AS image,
              "categoryId", "categoryName", badge, stock, featured, "createdAt"
  `;
  return toProduct(rows[0] as ProductRow);
}

/**
 * Updates only the fields in `patch`, as a single statement, so an order placed
 * during an edit can't have its stock change overwritten by a stale full row.
 */
export async function updateProductById(
  id: string,
  patch: ProductPatch & { categoryName?: string },
): Promise<Product | undefined> {
  const setOriginalPrice = "originalPrice" in patch;
  const setBadge = "badge" in patch;
  const { rows } = await sql`
    UPDATE products SET
      name = COALESCE(${patch.name ?? null}, name),
      slug = COALESCE(${patch.slug ?? null}, slug),
      description = COALESCE(${patch.description ?? null}, description),
      details = COALESCE(${patch.details ?? null}, details),
      price = COALESCE(${patch.price ?? null}::numeric, price),
      "originalPrice" = CASE WHEN ${setOriginalPrice}::boolean
                             THEN ${patch.originalPrice ?? null}::numeric
                             ELSE "originalPrice" END,
      image = COALESCE(${patch.image ?? null}, image),
      "categoryId" = COALESCE(${patch.categoryId ?? null}, "categoryId"),
      "categoryName" = COALESCE(${patch.categoryName ?? null}, "categoryName"),
      badge = CASE WHEN ${setBadge}::boolean
                   THEN ${patch.badge ?? null}::text
                   ELSE badge END,
      stock = COALESCE(${patch.stock ?? null}::integer, stock),
      featured = COALESCE(${patch.featured ?? null}::boolean, featured)
    WHERE id = ${id}
    RETURNING id, name, slug, description, details, price, "originalPrice",
              CASE WHEN image LIKE 'data:%'
                   THEN '/api/products/' || id || '/image/' || left(md5(image), 12)
                   ELSE image END AS image,
              "categoryId", "categoryName", badge, stock, featured, "createdAt"
  `;
  return rows[0] ? toProduct(rows[0] as ProductRow) : undefined;
}

export async function deleteProductById(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM products WHERE id = ${id}`;
  return (result.rowCount ?? 0) > 0;
}
