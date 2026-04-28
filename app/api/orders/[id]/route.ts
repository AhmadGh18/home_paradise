import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { OrderStatus } from '@/lib/types';

const VALID_STATUSES: OrderStatus[] = [
  'pending', 'processing', 'shipped', 'delivered', 'cancelled',
];

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const order = db.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const body = await request.json();
    const { status } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    db.orders[idx] = { ...db.orders[idx], ...(status ? { status } : {}) };
    return NextResponse.json(db.orders[idx]);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
