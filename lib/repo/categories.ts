import { sql } from "../db";
import type { Category } from "../types";

export async function listCategories(): Promise<Category[]> {
  const { rows } = await sql`
    SELECT id, name, slug, image, description
    FROM categories ORDER BY name
  `;
  return rows as Category[];
}

export async function findCategoryById(id: string): Promise<Category | undefined> {
  const { rows } = await sql`
    SELECT id, name, slug, image, description
    FROM categories WHERE id = ${id}
  `;
  return rows[0] as Category | undefined;
}
