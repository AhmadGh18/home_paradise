import { ORDER_STATUSES } from "./order-status";
import type { Order, Product } from "./types";

export const DASHBOARD_RANGES = [7, 30, 90] as const;
export type DashboardRange = (typeof DASHBOARD_RANGES)[number];

export function parseDashboardRange(value: string | undefined): DashboardRange {
  const parsed = Number(value);
  return DASHBOARD_RANGES.find((range) => range === parsed) ?? 30;
}

export interface RevenueBucket {
  label: string;
  revenue: number;
  orders: number;
}

const LOW_STOCK_THRESHOLD = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
// Fixed locale and time zone, so the numbers don't depend on where this runs.
const dayLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const sumRevenue = (orders: Order[]) =>
  orders.reduce((cents, o) => cents + Math.round(o.total * 100), 0) / 100;

export function buildDashboard(
  orders: Order[],
  products: Product[],
  range: DashboardRange,
  now = new Date(),
) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const start = today - (range - 1) * DAY_MS;
  const previousStart = start - range * DAY_MS;

  const inPeriod = orders.filter((o) => Date.parse(o.createdAt) >= start);
  const sold = (list: Order[]) => list.filter((o) => o.status !== "cancelled");

  const soldInPeriod = sold(inPeriod);
  const revenue = sumRevenue(soldInPeriod);
  const previousRevenue = sumRevenue(
    sold(
      orders.filter((o) => {
        const placed = Date.parse(o.createdAt);
        return placed >= previousStart && placed < start;
      }),
    ),
  );

  // 90 daily bars would be too thin to read, so that range groups by week.
  const bucketDays = range === 90 ? 7 : 1;
  const bucketCount = Math.ceil(range / bucketDays);
  const buckets: RevenueBucket[] = Array.from({ length: bucketCount }, (_, i) => {
    const first = start + i * bucketDays * DAY_MS;
    const last = Math.min(first + (bucketDays - 1) * DAY_MS, today);
    return {
      label:
        first === last
          ? dayLabel.format(first)
          : `${dayLabel.format(first)} – ${dayLabel.format(last)}`,
      revenue: 0,
      orders: 0,
    };
  });
  for (const order of soldInPeriod) {
    const offset = Math.floor((Date.parse(order.createdAt) - start) / DAY_MS);
    const bucket = buckets[Math.floor(offset / bucketDays)];
    if (bucket) {
      bucket.revenue = Math.round((bucket.revenue + order.total) * 100) / 100;
      bucket.orders += 1;
    }
  }

  const lowStock = products
    .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  return {
    revenue,
    // Without earlier sales, a percentage change would mean nothing.
    revenueChange:
      previousRevenue > 0
        ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100)
        : null,
    orderCount: soldInPeriod.length,
    averageOrder:
      soldInPeriod.length > 0
        ? Math.round((revenue / soldInPeriod.length) * 100) / 100
        : 0,
    buckets,
    statusCounts: ORDER_STATUSES.map((status) => ({
      status,
      count: inPeriod.filter((o) => o.status === status).length,
    })),
    latestOrders: [...inPeriod]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6),
    // Work still to do doesn't depend on the selected period.
    toFulfil: orders.filter(
      (o) => o.status === "pending" || o.status === "processing",
    ).length,
    lowStock,
  };
}
