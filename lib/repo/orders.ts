import { sql } from "../db";
import type { Order, OrderItem, OrderStatus } from "../types";

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

export async function updateOrderStatusById(
  id: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  const result = await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  if ((result.rowCount ?? 0) === 0) return undefined;
  return findOrderById(id);
}
