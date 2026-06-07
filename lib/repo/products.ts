import { sql } from "../db";
import type { Product } from "../types";

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

export async function listProducts(filters?: {
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

export async function findProductById(id: string): Promise<Product | undefined> {
  const { rows } = await sql`
    SELECT id, name, slug, description, details, price, "originalPrice", image,
           "categoryId", "categoryName", badge, stock, featured, "createdAt"
    FROM products WHERE id = ${id}
  `;
  return rows[0] ? toProduct(rows[0] as ProductRow) : undefined;
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
  const existing = await findProductById(id);
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
