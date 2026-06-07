import { type NextRequest } from "next/server";
import { badRequest, created, generateId, ok, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { createOrder, listOrders } from "@/lib/repo/orders";
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
  const items = Array.isArray(body.items) ? (body.items as OrderItem[]) : [];

  if (!customerName || !customerEmail || !customerPhone) {
    return badRequest("Customer name, email and phone are required");
  }
  if (items.length === 0) return badRequest("Order must contain items");

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const order: Order = {
    id: generateId("ord"),
    customerName,
    customerEmail,
    customerPhone,
    address,
    items: items.map((i) => ({
      productId: String(i.productId),
      productName: String(i.productName),
      price: Number(i.price),
      quantity: Number(i.quantity),
    })),
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    await createOrder(order);
    return created(order);
  } catch {
    return serverError("Failed to create order");
  }
}
