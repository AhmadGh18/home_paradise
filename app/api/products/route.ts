import { type NextRequest } from "next/server";
import {
  badRequest,
  created,
  generateId,
  ok,
  parseRequestBody,
  serverError,
} from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { findCategoryById } from "@/lib/repo/categories";
import { createProduct, listProducts } from "@/lib/repo/products";
import type { Product } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const featuredParam = searchParams.get("featured");
  const featured =
    featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;

  return ok(listProducts({ categoryId, featured }));
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await parseRequestBody(request);
  } catch {
    return badRequest();
  }

  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const description = String(body.description ?? "").trim();
  const categoryId = String(body.categoryId ?? "").trim();
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name || !slug || !description || !categoryId) {
    return badRequest("name, slug, description and categoryId are required");
  }
  if (!Number.isFinite(price) || price < 0) return badRequest("Invalid price");
  if (!Number.isInteger(stock) || stock < 0) return badRequest("Invalid stock");

  const category = findCategoryById(categoryId);
  if (!category) return badRequest("Unknown categoryId");

  const product: Product = {
    id: generateId("prod"),
    name,
    slug,
    description,
    details: body.details ? String(body.details) : undefined,
    price,
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    image: body.image ? String(body.image) : "",
    categoryId,
    categoryName: category.name,
    badge: body.badge ? String(body.badge) : undefined,
    stock,
    featured: body.featured === true || body.featured === "true",
    createdAt: new Date().toISOString(),
  };

  try {
    createProduct(product);
    return created(product);
  } catch {
    return serverError("Failed to create product");
  }
}
