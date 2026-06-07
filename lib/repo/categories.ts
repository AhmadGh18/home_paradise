import { getDb } from "../db";
import type { Category } from "../types";

export function listCategories(): Category[] {
  return getDb()
    .prepare("SELECT id, name, slug, image, description FROM categories ORDER BY name")
    .all() as Category[];
}

export function findCategoryById(id: string): Category | undefined {
  return getDb()
    .prepare("SELECT id, name, slug, image, description FROM categories WHERE id = ?")
    .get(id) as Category | undefined;
}
