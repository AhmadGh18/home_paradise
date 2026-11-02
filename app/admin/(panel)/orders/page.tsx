"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  ORDER_STATUSES,
} from "@/lib/order-status";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const FILTERS: (OrderStatus | "all")[] = ["all", ...ORDER_STATUSES];

const orderDate = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const itemCount = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) {
        setError(data?.error || "We couldn't load your orders.");
        return;
      }
      setOrders(data);
      setError(null);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const saveStatus = async (order: Order, status: OrderStatus) => {
    setSaving(order.id);
    setSavedId(null);
    setRowError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setOrders((all) => all.map((o) => (o.id === order.id ? data : o)));
        setSavedId(order.id);
      } else {
        setRowError({
          id: order.id,
          message: data?.error || "We couldn't save this. Please try again.",
        });
      }
    } catch {
      setRowError({
        id: order.id,
        message: "We couldn't reach the server. Please try again.",
      });
    } finally {
      setSaving(null);
    }
  };

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: orders.length };
    for (const order of orders) {
      result[order.status] = (result[order.status] ?? 0) + 1;
    }
    return result;
  }, [orders]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders
      .filter((o) => filter === "all" || o.status === filter)
      .filter(
        (o) =>
          !query ||
          [o.customerName, o.customerEmail, o.customerPhone, o.id]
            .join(" ")
            .toLowerCase()
            .includes(query),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, filter, search]);

  return (
    <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-[clamp(36px,4vw,52px)] text-ink">Orders</h1>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="min-h-11 border border-beige bg-white px-4 text-[14px] text-ink transition-colors duration-150 hover:bg-cream-deep/50 disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mt-6 flex overflow-x-auto border-b border-beige [scrollbar-width:none]">
        {FILTERS.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[14px] transition-colors duration-150 ${
              filter === option
                ? "border-terracotta text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {option === "all" ? "All" : ORDER_STATUS_LABEL[option]}
            <span className="text-[12px] tabular-nums text-ink-soft">
              {counts[option] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <label className="mb-4 mt-4 block">
        <span className="sr-only">Search orders</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email or order"
          className="w-full border border-beige bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors duration-150 placeholder:text-ink-soft/70 focus:border-sage-dark"
        />
      </label>

      {error && (
        <p role="alert" className="mb-4 border-l-2 border-terracotta bg-terracotta/10 px-4 py-3 text-[14px] text-ink">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-16 text-center text-[14px] text-ink-soft">Loading orders…</p>
      ) : visible.length === 0 ? (
        <p className="border border-beige bg-white py-16 text-center text-[14px] text-ink-soft">
          {search.trim() || filter !== "all"
            ? "No orders match this view."
            : "No orders yet. New orders will appear here."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isOpen={expanded === order.id}
              isSaving={saving === order.id}
              justSaved={savedId === order.id}
              error={rowError?.id === order.id ? rowError.message : null}
              onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              onSave={(status) => saveStatus(order, status)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function stockNote(from: OrderStatus, to: OrderStatus): string | null {
  if (to === "cancelled" && from !== "cancelled") {
    return "Saving will return these items to stock.";
  }
  if (from === "cancelled" && to !== "cancelled") {
    return "Saving will take these items out of stock again.";
  }
  return null;
}

function OrderCard({
  order,
  isOpen,
  isSaving,
  justSaved,
  error,
  onToggle,
  onSave,
}: {
  order: Order;
  isOpen: boolean;
  isSaving: boolean;
  justSaved: boolean;
  error: string | null;
  onToggle: () => void;
  onSave: (status: OrderStatus) => void;
}) {
  // Nothing changes on the server until Save is pressed.
  const [draft, setDraft] = useState<OrderStatus>(order.status);
  const changed = draft !== order.status;
  const count = itemCount(order);
  const note = changed ? stockNote(order.status, draft) : null;

  return (
    <li className="border border-beige bg-white">
      <form
        className="p-4 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (changed) onSave(draft);
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[16px] font-medium text-ink">{order.customerName}</p>
              <span
                className={`px-2 py-0.5 text-[12px] font-medium ${ORDER_STATUS_STYLE[order.status]}`}
              >
                {ORDER_STATUS_LABEL[order.status]}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-ink-soft">
              {orderDate.format(new Date(order.createdAt))} · {count}{" "}
              {count === 1 ? "item" : "items"}
            </p>
          </div>
          <p className="text-[17px] font-semibold tabular-nums text-ink">
            {formatPrice(order.total)}
          </p>
        </div>

        <fieldset disabled={isSaving} className="mt-4">
          <legend className="mb-2 text-[13px] text-ink-soft">Status</legend>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            {ORDER_STATUSES.map((status) => (
              <label key={status} className="cursor-pointer has-[:disabled]:cursor-default">
                <input
                  type="radio"
                  name={`status-${order.id}`}
                  value={status}
                  checked={draft === status}
                  onChange={() => setDraft(status)}
                  className="peer sr-only"
                />
                <span
                  className={`flex min-h-11 items-center justify-center border px-4 text-[14px] transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta ${
                    draft !== status
                      ? "border-beige text-ink-soft hover:border-ink/40 hover:text-ink"
                      : status === "cancelled"
                        ? "border-red-700 bg-red-700 text-white"
                        : "border-sage-dark bg-sage-dark text-cream"
                  }`}
                >
                  {ORDER_STATUS_LABEL[status]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {note && <p className="mt-3 text-[13px] text-ink-soft">{note}</p>}

        {error && (
          <p role="alert" className="mt-3 border-l-2 border-terracotta bg-terracotta/10 px-3 py-2 text-[14px] text-ink">
            {error}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="submit"
            disabled={!changed || isSaving}
            className="min-h-11 bg-sage-dark px-6 text-[14px] font-medium text-cream transition-[background-color,scale] duration-150 enabled:hover:bg-ink enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          {changed && !isSaving && (
            <button
              type="button"
              onClick={() => setDraft(order.status)}
              className="link-underline py-2 text-[13px] text-ink-soft"
            >
              Undo
            </button>
          )}
          <span role="status" className="text-[13px] text-ink-soft">
            {justSaved && !changed ? "Saved" : ""}
          </span>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="ml-auto flex min-h-11 items-center gap-1.5 px-2 text-[14px] text-ink-soft transition-colors duration-150 hover:text-ink"
          >
            {isOpen ? "Hide details" : "Details"}
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 fill-none stroke-current transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </form>

      {isOpen && (
        <div className="border-t border-cream-deep p-4 sm:p-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ink-soft">
                Customer
              </h2>
              <p className="text-[14px] text-ink">{order.customerName}</p>
              <a href={`tel:${order.customerPhone}`} className="link-underline mt-1 inline-block py-1 text-[14px] text-ink">
                {order.customerPhone}
              </a>
              <br />
              <a href={`mailto:${order.customerEmail}`} className="link-underline inline-block break-all py-1 text-[14px] text-ink">
                {order.customerEmail}
              </a>
              <h2 className="mb-2 mt-4 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ink-soft">
                Deliver to
              </h2>
              <p className="whitespace-pre-line text-[14px] text-ink">{order.address}</p>
            </div>

            <div>
              <h2 className="mb-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ink-soft">
                Items
              </h2>
              <ul className="divide-y divide-cream-deep">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between gap-3 py-2 text-[14px]">
                    <span className="min-w-0 text-ink">
                      {item.productName}
                      <span className="text-ink-soft"> × {item.quantity}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex justify-between border-t border-beige pt-2 text-[14px] font-semibold text-ink">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 break-all border-t border-cream-deep pt-3 font-mono text-[12px] text-ink-soft">
            {order.id}
          </p>
        </div>
      )}
    </li>
  );
}
