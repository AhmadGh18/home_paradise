import Link from "next/link";
import RevenueChart from "@/components/admin/RevenueChart";
import {
  buildDashboard,
  DASHBOARD_RANGES,
  parseDashboardRange,
} from "@/lib/dashboard";
import { listOrders } from "@/lib/repo/orders";
import { listProducts } from "@/lib/repo/products";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const orderDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const card = "border border-beige bg-white";
const cardTitle = "text-[15px] font-medium text-ink";

interface Props {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminDashboard({ searchParams }: Props) {
  const [{ range: rangeParam }, products, orders] = await Promise.all([
    searchParams,
    listProducts(),
    listOrders(),
  ]);
  const range = parseDashboardRange(rangeParam);
  const data = buildDashboard(orders, products, range);
  const maxStatusCount = Math.max(1, ...data.statusCounts.map((s) => s.count));

  const attention = [
    {
      href: "/admin/orders",
      count: data.toFulfil,
      one: "order to fulfil",
      many: "orders to fulfil",
      clear: "All orders are fulfilled",
    },
    {
      href: "/admin/products",
      count: data.lowStock.length,
      one: "product low on stock",
      many: "products low on stock",
      clear: "Stock levels look healthy",
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-10">
      <h1 className="font-serif text-[clamp(36px,4vw,52px)] text-ink">
        Dashboard
      </h1>

      {/* What needs doing now, whichever period is selected */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {attention.map(({ href, count, one, many, clear }) => (
          <Link
            key={href}
            href={href}
            className={`group flex items-center justify-between gap-4 border p-4 transition-colors duration-200 sm:p-5 ${
              count > 0
                ? "border-terracotta-soft bg-terracotta-soft/15 hover:bg-terracotta-soft/25"
                : "border-beige bg-white hover:bg-cream-deep/40"
            }`}
          >
            <span className="flex items-baseline gap-2.5">
              {count > 0 ? (
                <>
                  <span className="text-[26px] font-semibold leading-none text-ink">
                    {count}
                  </span>
                  <span className="text-[15px] text-ink">
                    {count === 1 ? one : many}
                  </span>
                </>
              ) : (
                <span className="text-[15px] text-ink-soft">{clear}</span>
              )}
            </span>
            <span
              aria-hidden="true"
              className="text-ink-soft transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        ))}
      </div>

      {/* Period: applies to everything below this row */}
      <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-[26px] text-ink">Performance</h2>
        <nav aria-label="Time period" className="flex border border-beige bg-white">
          {DASHBOARD_RANGES.map((option) => (
            <Link
              key={option}
              href={`/admin?range=${option}`}
              scroll={false}
              aria-current={option === range ? "page" : undefined}
              className={`px-3.5 py-2.5 text-[13px] transition-colors duration-200 ${
                option === range
                  ? "bg-sage-dark text-cream"
                  : "text-ink-soft hover:bg-cream-deep/50 hover:text-ink"
              }`}
            >
              {option} days
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue */}
        <section className={`${card} min-w-0 p-5 sm:p-6 lg:col-span-2`}>
          <h3 className={cardTitle}>Revenue</h3>
          <p className="mt-2 text-[clamp(40px,4.4vw,56px)] font-semibold leading-none tracking-tight text-ink">
            {formatPrice(data.revenue)}
          </p>
          <p className="mb-7 mt-2.5 text-[13px] text-ink-soft">
            {data.revenueChange === null
              ? `Last ${range} days`
              : data.revenueChange === 0
                ? `No change from the previous ${range} days`
                : `${data.revenueChange > 0 ? "Up" : "Down"} ${Math.abs(data.revenueChange)}% from the previous ${range} days`}
            {" · excludes cancelled orders"}
          </p>
          <RevenueChart buckets={data.buckets} />
        </section>

        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <div className="grid grid-cols-2 gap-4">
            <section className={`${card} min-w-0 p-4 sm:p-5`}>
              <h3 className="text-[13px] text-ink-soft">Orders</h3>
              <p className="mt-1.5 text-[28px] font-semibold leading-none text-ink">
                {data.orderCount}
              </p>
              <p className="mt-2 text-[12px] text-ink-soft">Excludes cancelled</p>
            </section>
            <section className={`${card} min-w-0 p-4 sm:p-5`}>
              <h3 className="text-[13px] text-ink-soft">Average order</h3>
              <p className="mt-1.5 text-[28px] font-semibold leading-none text-ink">
                {formatPrice(data.averageOrder)}
              </p>
              <p className="mt-2 text-[12px] text-ink-soft">Excludes cancelled</p>
            </section>
          </div>

          <section className={`${card} p-5 sm:p-6`}>
            <h3 className={`${cardTitle} mb-5`}>All orders by status</h3>
            <ul className="space-y-3.5">
              {data.statusCounts.map(({ status, count }) => (
                <li key={status}>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="text-ink-soft">{ORDER_STATUS_LABEL[status]}</span>
                    <span className="tabular-nums text-ink">{count}</span>
                  </div>
                  <div className="h-2 bg-cream-deep/70">
                    {count > 0 && (
                      <div
                        className="h-full rounded-r-[4px] bg-chart"
                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Latest orders */}
        <section className={`${card} min-w-0 lg:col-span-2`}>
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <h3 className={cardTitle}>Latest orders</h3>
            <Link href="/admin/orders" className="link-underline text-[13px] text-ink-soft">
              All orders
            </Link>
          </div>
          {data.latestOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[14px]">
                <thead>
                  <tr className="border-y border-cream-deep text-left text-[12px] text-ink-soft">
                    <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">Customer</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Date</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium sm:px-6">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.latestOrders.map((order) => (
                    <tr key={order.id} className="border-b border-cream-deep last:border-0">
                      <td className="px-5 py-3 sm:px-6">
                        <div className="text-ink">{order.customerName}</div>
                        <div className="text-[12px] text-ink-soft">{order.customerEmail}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[12px] font-medium ${ORDER_STATUS_STYLE[order.status]}`}
                        >
                          {ORDER_STATUS_LABEL[order.status]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[13px] text-ink-soft">
                        {orderDate.format(new Date(order.createdAt))}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-ink sm:px-6">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="border-t border-cream-deep px-6 py-12 text-center text-[14px] text-ink-soft">
              No orders in the last {range} days.
            </p>
          )}
        </section>

        {/* Low stock */}
        <section className={`${card} min-w-0 self-start`}>
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <h3 className={cardTitle}>Low stock</h3>
            <Link href="/admin/products" className="link-underline text-[13px] text-ink-soft">
              All products
            </Link>
          </div>
          {data.lowStock.length > 0 ? (
            <ul className="border-t border-cream-deep">
              {data.lowStock.slice(0, 6).map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 border-b border-cream-deep px-5 py-3 text-[14px] last:border-0 sm:px-6"
                >
                  <span className="min-w-0 truncate text-ink">{product.name}</span>
                  <span className="shrink-0 tabular-nums text-ink-soft">
                    {product.stock === 0 ? "Sold out" : `${product.stock} left`}
                  </span>
                </li>
              ))}
              {data.lowStock.length > 6 && (
                <li className="px-5 py-3 text-[13px] text-ink-soft sm:px-6">
                  And {data.lowStock.length - 6} more
                </li>
              )}
            </ul>
          ) : (
            <p className="border-t border-cream-deep px-6 py-12 text-center text-[14px] text-ink-soft">
              Nothing is running low.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
