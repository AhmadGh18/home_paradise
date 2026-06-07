import { getDb } from "../db";
import type { Product } from "../types";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  originalPrice: number | null;
  image: string;
  categoryId: string;
  categoryName: string | null;
  badge: string | null;
  stock: number;
  featured: number;
  createdAt: string;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    details: row.details || undefined,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    image: row.image,
    categoryId: row.categoryId,
    categoryName: row.categoryName ?? undefined,
    badge: row.badge ?? undefined,
    stock: row.stock,
    featured: Boolean(row.featured),
    createdAt: row.createdAt,
  };
}

const COLUMNS =
  "id, name, slug, description, details, price, originalPrice, image, categoryId, categoryName, badge, stock, featured, createdAt";

export function listProducts(filters?: {
  categoryId?: string;
  featured?: boolean;
}): Product[] {
  const db = getDb();
  const where: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters?.categoryId) {
    where.push("categoryId = @categoryId");
    params.categoryId = filters.categoryId;
  }
  if (filters?.featured !== undefined) {
    where.push("featured = @featured");
    params.featured = filters.featured ? 1 : 0;
  }

  const sql = `SELECT ${COLUMNS} FROM products ${
    where.length ? "WHERE " + where.join(" AND ") : ""
  } ORDER BY createdAt DESC`;

  return (db.prepare(sql).all(params) as ProductRow[]).map(toProduct);
}

export function findProductById(id: string): Product | undefined {
  const row = getDb()
    .prepare(`SELECT ${COLUMNS} FROM products WHERE id = ?`)
    .get(id) as ProductRow | undefined;
  return row ? toProduct(row) : undefined;
}

export function findProductBySlug(slug: string): Product | undefined {
  const row = getDb()
    .prepare(`SELECT ${COLUMNS} FROM products WHERE slug = ?`)
    .get(slug) as ProductRow | undefined;
  return row ? toProduct(row) : undefined;
}

export function createProduct(p: Product): Product {
  getDb()
    .prepare(
      `INSERT INTO products (${COLUMNS}) VALUES
         (@id,@name,@slug,@description,@details,@price,@originalPrice,@image,@categoryId,@categoryName,@badge,@stock,@featured,@createdAt)`,
    )
    .run({
      ...p,
      details: p.details ?? "",
      originalPrice: p.originalPrice ?? null,
      categoryName: p.categoryName ?? null,
      badge: p.badge ?? null,
      featured: p.featured ? 1 : 0,
    });
  return p;
}

export function updateProductById(
  id: string,
  patch: Partial<Product>,
): Product | undefined {
  const existing = findProductById(id);
  if (!existing) return undefined;
  const next: Product = { ...existing, ...patch };

  getDb()
    .prepare(
      `UPDATE products SET
         name=@name, slug=@slug, description=@description, details=@details,
         price=@price, originalPrice=@originalPrice, image=@image,
         categoryId=@categoryId, categoryName=@categoryName, badge=@badge,
         stock=@stock, featured=@featured
       WHERE id=@id`,
    )
    .run({
      ...next,
      details: next.details ?? "",
      originalPrice: next.originalPrice ?? null,
      categoryName: next.categoryName ?? null,
      badge: next.badge ?? null,
      featured: next.featured ? 1 : 0,
    });

  return next;
}

export function deleteProductById(id: string): boolean {
  return getDb().prepare("DELETE FROM products WHERE id = ?").run(id).changes > 0;
}
