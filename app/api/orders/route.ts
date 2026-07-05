import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { badRequest, created, generateId, ok, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createOrderWithInventory,
  listOrders,
  OutOfStockError,
} from "@/lib/repo/orders";
import { findProductByIdFresh, PRODUCTS_TAG } from "@/lib/repo/products";
import type { Order, OrderItem } from "@/lib/types";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return ok(await listOrders());
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest();
  }

  const customerName = String(body.customerName ?? "").trim();
  const customerEmail = String(body.customerEmail ?? "").trim();
  const customerPhone = String(body.customerPhone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (!customerName || !customerEmail || !customerPhone) {
    return badRequest("Customer name, email and phone are required");
  }
  if (rawItems.length === 0) return badRequest("Order must contain items");

  // Collapse duplicate lines and validate quantities up front. Prices and
  // names are deliberately NOT read from the client — they are resolved from
  // the database below so the order total can't be forged.
  const requested = new Map<string, number>();
  for (const raw of rawItems) {
    const productId = String((raw as { productId?: unknown }).productId ?? "");
    const quantity = Number((raw as { quantity?: unknown }).quantity);
    if (!productId) return badRequest("Each item requires a productId");
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return badRequest("Each item requires a positive integer quantity");
    }
    requested.set(productId, (requested.get(productId) ?? 0) + quantity);
  }

  const items: OrderItem[] = [];
  for (const [productId, quantity] of requested) {
    const product = await findProductByIdFresh(productId);
    if (!product) return badRequest(`Unknown product: ${productId}`);
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `"${product.name}" is out of stock` },
        { status: 409 },
      );
    }
    items.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
    });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order: Order = {
    id: generateId("ord"),
    customerName,
    customerEmail,
    customerPhone,
    address,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    await createOrderWithInventory(order);
    revalidateTag(PRODUCTS_TAG); // stock changed — refresh storefront caches
    return created(order);
  } catch (err) {
    if (err instanceof OutOfStockError) {
      return NextResponse.json({ error: `${err.productName} is out of stock` }, {
        status: 409,
      });
    }
    return serverError("Failed to create order");
  }
}
