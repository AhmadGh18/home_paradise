import {
  HttpError,
  isUniqueViolation,
  notFound,
  ok,
  parseRequestBody,
  route,
} from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { findCategoryById } from "@/lib/repo/categories";
import {
  deleteProductById,
  findProductById,
  findProductByIdFresh,
  invalidateProducts,
  updateProductById,
} from "@/lib/repo/products";
import { isValidId, parseProductPatch } from "@/lib/validation";

interface Context {
  params: Promise<{ id: string }>;
}

export const GET = route<Context>(async (_request, { params }) => {
  const { id } = await params;
  const product = isValidId(id) ? await findProductById(id) : undefined;
  return product ? ok(product) : notFound();
});

export const PUT = route<Context>(async (request, { params }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const existing = isValidId(id) ? await findProductByIdFresh(id) : undefined;
  if (!existing) return notFound();

  const patch = parseProductPatch(await parseRequestBody(request), existing);

  let categoryName: string | undefined;
  if (patch.categoryId !== undefined) {
    const category = await findCategoryById(patch.categoryId);
    if (!category) throw new HttpError(400, "Unknown category");
    categoryName = category.name;
  }

  try {
    const updated = await updateProductById(id, { ...patch, categoryName });
    if (!updated) return notFound();
    invalidateProducts();
    return ok(updated);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new HttpError(409, "A product with this slug already exists");
    }
    throw err;
  }
});

export const DELETE = route<Context>(async (request, { params }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidId(id) || !(await deleteProductById(id))) return notFound();

  invalidateProducts();
  return ok({ success: true });
});
