import { getDb } from "../db";
import type { Order, OrderItem, OrderStatus } from "../types";

interface OrderRow {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

function toOrder(row: OrderRow): Order {
  return {
    ...row,
    items: JSON.parse(row.items) as OrderItem[],
  };
}

const COLUMNS =
  "id, customerName, customerEmail, customerPhone, address, items, total, status, createdAt";

export function listOrders(): Order[] {
  const rows = getDb()
    .prepare(`SELECT ${COLUMNS} FROM orders ORDER BY createdAt DESC`)
    .all() as OrderRow[];
  return rows.map(toOrder);
}

export function findOrderById(id: string): Order | undefined {
  const row = getDb()
    .prepare(`SELECT ${COLUMNS} FROM orders WHERE id = ?`)
    .get(id) as OrderRow | undefined;
  return row ? toOrder(row) : undefined;
}

export function createOrder(o: Order): Order {
  getDb()
    .prepare(
      `INSERT INTO orders (${COLUMNS}) VALUES
         (@id,@customerName,@customerEmail,@customerPhone,@address,@items,@total,@status,@createdAt)`,
    )
    .run({ ...o, items: JSON.stringify(o.items) });
  return o;
}

export function updateOrderStatusById(
  id: string,
  status: OrderStatus,
): Order | undefined {
  const result = getDb()
    .prepare("UPDATE orders SET status = ? WHERE id = ?")
    .run(status, id);
  if (result.changes === 0) return undefined;
  return findOrderById(id);
}
