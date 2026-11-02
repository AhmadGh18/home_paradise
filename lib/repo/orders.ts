import type { VercelPoolClient } from "@vercel/postgres";
import { generateId, HttpError } from "../api";
import { sql, withTransaction } from "../db";
import type { Order, OrderItem, OrderStatus } from "../types";
import type { NewOrder } from "../validation";

// Customers see this message, so it never reveals how many are left.
const outOfStock = (name: string) =>
  new HttpError(
    409,
    `"${name}" isn't available in that quantity. Please reduce it and try again.`,
  );

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

interface LockedProduct {
  id: string;
  name: string;
  price: string;
  stock: number;
}

/**
 * Locks products until the transaction ends so concurrent orders queue up
 * instead of overselling. Rows are locked in id order to rule out deadlocks.
 */
async function lockProducts(
  tx: VercelPoolClient,
  ids: string[],
): Promise<Map<string, LockedProduct>> {
  const { rows } = await tx.sql`
    SELECT id, name, price, stock FROM products
    WHERE id IN (SELECT jsonb_array_elements_text(${JSON.stringify(ids)}::jsonb))
    ORDER BY id
    FOR UPDATE
  `;
  return new Map((rows as LockedProduct[]).map((p) => [p.id, p]));
}

async function adjustStock(
  tx: VercelPoolClient,
  changes: { id: string; delta: number }[],
): Promise<void> {
  await tx.sql`
    UPDATE products AS p SET stock = p.stock + c.delta
    FROM jsonb_to_recordset(${JSON.stringify(changes)}::jsonb)
      AS c(id text, delta integer)
    WHERE p.id = c.id
  `;
}

/**
 * Places an order and takes its items out of stock as one atomic step. Prices
 * and names are read from the locked rows, so the total can't be forged and
 * can't go stale between reading it and writing the order.
 */
export function placeOrder(input: NewOrder): Promise<Order> {
  return withTransaction(async (tx) => {
    const products = await lockProducts(
      tx,
      input.items.map((i) => i.productId),
    );

    let totalCents = 0;
    const items: OrderItem[] = input.items.map(({ productId, quantity }) => {
      const product = products.get(productId);
      if (!product) {
        throw new HttpError(400, "An item in your order is no longer available");
      }
      if (product.stock < quantity) {
        throw outOfStock(product.name);
      }
      const price = Number(product.price);
      totalCents += Math.round(price * 100) * quantity;
      return { productId, productName: product.name, price, quantity };
    });

    await adjustStock(
      tx,
      items.map((i) => ({ id: i.productId, delta: -i.quantity })),
    );

    const order: Order = {
      id: generateId("ord"),
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      address: input.address,
      items,
      total: totalCents / 100,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await tx.sql`
      INSERT INTO orders (id, "customerName", "customerEmail", "customerPhone", address,
                          items, total, status, "createdAt")
      VALUES (${order.id}, ${order.customerName}, ${order.customerEmail}, ${order.customerPhone},
              ${order.address}, ${JSON.stringify(order.items)}, ${order.total}, ${order.status},
              ${order.createdAt})
    `;
    return order;
  });
}

/**
 * Changes an order's status. Cancelling returns its items to stock, and
 * un-cancelling takes them out again, failing if there is no longer enough.
 */
export function updateOrderStatusById(
  id: string,
  status: OrderStatus,
): Promise<{ order: Order; stockChanged: boolean } | undefined> {
  return withTransaction(async (tx) => {
    const { rows } = await tx.sql`
      SELECT id, "customerName", "customerEmail", "customerPhone", address,
             items, total, status, "createdAt"
      FROM orders WHERE id = ${id}
      FOR UPDATE
    `;
    if (!rows[0]) return undefined;
    const order = toOrder(rows[0] as OrderRow);

    const cancelling = order.status !== "cancelled" && status === "cancelled";
    const reinstating = order.status === "cancelled" && status !== "cancelled";

    if (cancelling || reinstating) {
      const quantities = new Map<string, number>();
      for (const item of order.items) {
        quantities.set(
          item.productId,
          (quantities.get(item.productId) ?? 0) + item.quantity,
        );
      }
      const products = await lockProducts(tx, [...quantities.keys()]);

      if (reinstating) {
        for (const item of order.items) {
          const available = products.get(item.productId)?.stock ?? 0;
          if (available < (quantities.get(item.productId) ?? 0)) {
            throw outOfStock(item.productName);
          }
        }
      }

      await adjustStock(
        tx,
        [...quantities].map(([productId, quantity]) => ({
          id: productId,
          delta: cancelling ? quantity : -quantity,
        })),
      );
    }

    await tx.sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
    return {
      order: { ...order, status },
      stockChanged: cancelling || reinstating,
    };
  });
}
