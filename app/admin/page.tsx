import Link from "next/link";
import { getProducts, getOrders } from "@/lib/data";
import type { Order } from "@/lib/types";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const products = getProducts();
  const orders = getOrders();
  const revenue = orders.reduce((sum: number, o: Order) => sum + o.total, 0);
  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  };

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      href: "/admin/products",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-sage-dark fill-none"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13z" />
        </svg>
      ),
      bg: "bg-sage-light/40",
    },
    {
      label: "Total Orders",
      value: orders.length,
      href: "/admin/orders",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-terracotta fill-none"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5A2 2 0 0 1 7.5 18L6 7z" />
          <path d="M9 7a3 3 0 1 1 6 0" />
        </svg>
      ),
      bg: "bg-terracotta-soft/20",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      href: "/admin/orders",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-ink fill-none"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M9 9a3 3 0 0 1 6 0 3 3 0 0 1-6 0" />
          <path d="M15 15a3 3 0 0 1-6 0" />
        </svg>
      ),
      bg: "bg-beige/60",
    },
    {
      label: "Low Stock",
      value: products.filter((p: Product) => p.stock <= 5).length,
      href: "/admin/products",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-yellow-600 fill-none"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl text-ink">Dashboard</h1>
        <p className="text-ink-soft text-sm mt-1">
          Welcome back. Here's what's happening.
        </p>
      </div>

      {/* Stats - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-6 lg:mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-3 sm:gap-4"
          >
            <div
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-[12px] sm:text-[13px] text-ink-soft">
                {s.label}
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-ink">
                {s.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-ink text-base">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-sage-dark hover:underline"
          >
            View all →
          </Link>
        </div>
        {/* Scrollable table for mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 sm:px-6 py-3 text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-ink-soft"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3.5 font-mono text-xs text-ink-soft">
                    {order.id}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="font-medium text-ink">
                      {order.customerName}
                    </div>
                    <div className="text-ink-soft text-xs hidden sm:block">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 font-semibold text-ink">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-ink-soft text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
