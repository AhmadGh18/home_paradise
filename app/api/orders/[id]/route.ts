import { type NextRequest } from "next/server";
import { badRequest, notFound, ok, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/admin";
import { findOrderById, updateOrderStatusById } from "@/lib/repo/orders";
import type { OrderStatus } from "@/lib/types";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const order = await findOrderById(id);
  return order ? ok(order) : notFound();
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return badRequest();
  }

  const status = body.status;
  if (typeof status !== "string" || !VALID_STATUSES.includes(status as OrderStatus)) {
    return badRequest("Invalid status");
  }

  try {
    const updated = await updateOrderStatusById(id, status as OrderStatus);
    return updated ? ok(updated) : notFound();
  } catch {
    return serverError("Failed to update order");
  }
}
