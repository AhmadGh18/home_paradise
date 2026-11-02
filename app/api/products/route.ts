import {
  created,
  generateId,
  HttpError,
  isUniqueViolation,
  ok,
  parseRequestBody,
  route,
} from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { findCategoryById } from "@/lib/repo/categories";
import {
  createProduct,
  findProductsByIds,
  invalidateProducts,
  listProducts,
} from "@/lib/repo/products";
import { isValidId, parseNewProduct } from "@/lib/validation";

const MAX_IDS_PER_REQUEST = 100;

export const GET = route(async (request) => {
  const { searchParams } = request.nextUrl;

  // `?ids=a,b,c` — used by the cart to refresh its stored product snapshots.
  const idsParam = searchParams.get("ids");
  if (idsParam !== null) {
    const ids = idsParam.split(",").map((s) => s.trim()).filter(isValidId);
    if (ids.length > MAX_IDS_PER_REQUEST) {
      throw new HttpError(400, "Too many product ids");
    }
    return ok(await findProductsByIds(ids));
  }

  const categoryId = searchParams.get("categoryId") ?? undefined;
  if (categoryId !== undefined && !isValidId(categoryId)) return ok([]);

  const featuredParam = searchParams.get("featured");
  const featured =
    featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;

  return ok(await listProducts({ categoryId, featured }));
});

export const POST = route(async (request) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const fields = parseNewProduct(await parseRequestBody(request));

  const category = await findCategoryById(fields.categoryId);
  if (!category) throw new HttpError(400, "Unknown category");

  try {
    const product = await createProduct({
      ...fields,
      id: generateId("prod"),
      categoryName: category.name,
      createdAt: new Date().toISOString(),
    });
    invalidateProducts();
    return created(product);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new HttpError(409, "A product with this slug already exists");
    }
    throw err;
  }
});
