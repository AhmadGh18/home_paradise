import { sql } from "../db";
import type { Order, OrderItem, OrderStatus } from "../types";

/** Thrown when an order cannot be fulfilled because an item is out of stock. */
export class OutOfStockError extends Error {
  constructor(public readonly productName: string) {
    super(`Insufficient stock for "${productName}"`);
    this.name = "OutOfStockError";
  }
}

interface OrderRow {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: string;
  total: string;
  status: OrderStatus;
  createdAt: string;
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    address: row.address,
    items: JSON.parse(row.items) as OrderItem[],
    total: Number(row.total),
    status: row.status,
    createdAt: row.createdAt,
  };
}

export async function listOrders(): Promise<Order[]> {
  const { rows } = await sql`
    SELECT id, "customerName", "customerEmail", "customerPhone", address,
           items, total, status, "createdAt"
    FROM orders ORDER BY "createdAt" DESC
  `;
  return (rows as OrderRow[]).map(toOrder);
}

export async function findOrderById(id: string): Promise<Order | undefined> {
  const { rows } = await sql`
    SELECT id, "customerName", "customerEmail", "customerPhone", address,
           items, total, status, "createdAt"
    FROM orders WHERE id = ${id}
  `;
  return rows[0] ? toOrder(rows[0] as OrderRow) : undefined;
}

export async function createOrder(o: Order): Promise<Order> {
  await sql`
    INSERT INTO orders (id, "customerName", "customerEmail", "customerPhone", address,
                        items, total, status, "createdAt")
    VALUES (${o.id}, ${o.customerName}, ${o.customerEmail}, ${o.customerPhone},
            ${o.address}, ${JSON.stringify(o.items)}, ${o.total}, ${o.status},
            ${o.createdAt})
  `;
  return o;
}

/**
 * Creates an order and decrements product stock atomically-enough for a
 * low-concurrency store: each item's stock is decremented with a guarded
 * `stock >= quantity` condition so two racing orders can't oversell. If any
 * item is short, previously-decremented items are restored and an
 * {@link OutOfStockError} is thrown. The `@vercel/postgres` pooled client does
 * not expose interactive transactions, so we compensate manually instead.
 */
export async function createOrderWithInventory(o: Order): Promise<Order> {
  const decremented: OrderItem[] = [];
  try {
    for (const item of o.items) {
      const res = await sql`
        UPDATE products SET stock = stock - ${item.quantity}
        WHERE id = ${item.productId} AND stock >= ${item.quantity}
      `;
      if ((res.rowCount ?? 0) === 0) {
        throw new OutOfStockError(item.productName);
      }
      decremented.push(item);
    }
    await createOrder(o);
    return o;
  } catch (err) {
    for (const item of decremented) {
      await sql`
        UPDATE products SET stock = stock + ${item.quantity}
        WHERE id = ${item.productId}
      `;
    }
    throw err;
  }
}

export async function updateOrderStatusById(
  id: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  const result = await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  if ((result.rowCount ?? 0) === 0) return undefined;
  return findOrderById(id);
}
