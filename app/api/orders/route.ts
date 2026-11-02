import { created, ok, readJsonObject, HttpError, route } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { enforceRateLimit } from "@/lib/rate-limit";
import { listOrders, placeOrder } from "@/lib/repo/orders";
import { invalidateProducts } from "@/lib/repo/products";
import { parseNewOrder } from "@/lib/validation";

// Orders reserve stock with no payment step, so without a limit anyone could
// buy out the whole catalogue with a script.
const ORDER_LIMIT = { scope: "order", max: 10, windowSeconds: 15 * 60 };

export const GET = route(async (request) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return ok(await listOrders());
});

export const POST = route(async (request) => {
  try {
    await enforceRateLimit(request, ORDER_LIMIT);
  } catch (err) {
    if (err instanceof HttpError) throw err;
    // A limiter failure shouldn't stop a real customer from checking out.
    console.error("[api] order rate limit unavailable:", (err as Error).message);
  }

  const input = parseNewOrder(await readJsonObject(request));
  const order = await placeOrder(input);
  invalidateProducts(); // Stock changed.
  return created(order);
});
