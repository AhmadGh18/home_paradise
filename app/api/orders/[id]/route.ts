import { notFound, ok, readJsonObject, route } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { findOrderById, updateOrderStatusById } from "@/lib/repo/orders";
import { invalidateProducts } from "@/lib/repo/products";
import { isValidId, parseOrderStatus } from "@/lib/validation";

interface Context {
  params: Promise<{ id: string }>;
}

export const GET = route<Context>(async (request, { params }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const order = isValidId(id) ? await findOrderById(id) : undefined;
  return order ? ok(order) : notFound();
});

export const PATCH = route<Context>(async (request, { params }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const { status } = await readJsonObject(request);
  const result = await updateOrderStatusById(id, parseOrderStatus(status));
  if (!result) return notFound();

  if (result.stockChanged) invalidateProducts();
  return ok(result.order);
});
