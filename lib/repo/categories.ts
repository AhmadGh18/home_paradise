import { unstable_cache } from "next/cache";
import { sql } from "../db";
import type { Category } from "../types";

export const CATEGORIES_TAG = "categories";
const CACHE_TTL_SECONDS = 3600;

async function selectCategories(): Promise<Category[]> {
  const { rows } = await sql`
    SELECT id, name, slug, image, description
    FROM categories ORDER BY name
  `;
  return rows as Category[];
}

/** Cached category listing. Categories rarely change; invalidate via CATEGORIES_TAG. */
export const listCategories = unstable_cache(selectCategories, ["list-categories"], {
  tags: [CATEGORIES_TAG],
  revalidate: CACHE_TTL_SECONDS,
});

async function selectCategoryById(id: string): Promise<Category | undefined> {
  const { rows } = await sql`
    SELECT id, name, slug, image, description
    FROM categories WHERE id = ${id}
  `;
  return rows[0] as Category | undefined;
}

export const findCategoryById = unstable_cache(
  selectCategoryById,
  ["category-by-id"],
  { tags: [CATEGORIES_TAG], revalidate: CACHE_TTL_SECONDS },
);
