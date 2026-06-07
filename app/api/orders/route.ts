import { NextResponse } from "next/server";
import { getOrders, addOrder, generateId } from "@/lib/data";
import type { Order } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getOrders());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !Array.isArray(body.items)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const order: Order = {
      id: generateId("ord"),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address ?? "",
      items: body.items,
      total: Number(body.total),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
