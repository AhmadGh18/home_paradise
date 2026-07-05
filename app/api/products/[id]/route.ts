import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import {
  badRequest,
  notFound,
  ok,
  parseRequestBody,
  serverError,
} from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { findCategoryById } from "@/lib/repo/categories";
import {
  deleteProductById,
  findProductById,
  findProductByIdFresh,
  PRODUCTS_TAG,
  updateProductById,
} from "@/lib/repo/products";
import type { Product } from "@/lib/types";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  const product = await findProductById(id);
  return product ? ok(product) : notFound();
}

export async function PUT(request: NextRequest, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const existing = await findProductByIdFresh(id);
  if (!existing) return notFound();

  let body: Record<string, unknown>;
  try {
    body = await parseRequestBody(request);
  } catch {
    return badRequest();
  }

  const patch: Partial<Product> = {};
  if (body.name !== undefined) patch.name = String(body.name);
  if (body.slug !== undefined) patch.slug = String(body.slug);
  if (body.description !== undefined) patch.description = String(body.description);
  if (body.details !== undefined) patch.details = String(body.details);
  if (body.image !== undefined) patch.image = String(body.image);
  if (body.badge !== undefined) patch.badge = String(body.badge) || undefined;
  if (body.featured !== undefined)
    patch.featured = body.featured === true || body.featured === "true";

  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return badRequest("Invalid price");
    patch.price = price;
  }
  if (body.originalPrice !== undefined) {
    patch.originalPrice = body.originalPrice
      ? Number(body.originalPrice)
      : undefined;
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) return badRequest("Invalid stock");
    patch.stock = stock;
  }
  if (body.categoryId !== undefined) {
    const category = await findCategoryById(String(body.categoryId));
    if (!category) return badRequest("Unknown categoryId");
    patch.categoryId = category.id;
    patch.categoryName = category.name;
  }

  try {
    const updated = await updateProductById(id, patch);
    if (updated) revalidateTag(PRODUCTS_TAG);
    return updated ? ok(updated) : notFound();
  } catch {
    return serverError("Failed to update product");
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const deleted = await deleteProductById(id);
  if (deleted) revalidateTag(PRODUCTS_TAG);
  return deleted ? ok({ success: true }) : notFound();
}
