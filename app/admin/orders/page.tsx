'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Orders</h1>
        <p className="text-ink-soft text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === s ? 'bg-ink text-white' : 'bg-white border border-gray-200 text-ink-soft hover:border-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-soft">Loading…</div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Row */}
              <div className="flex flex-wrap items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink">{order.customerName}</div>
                  <div className="text-[12px] text-ink-soft">{order.customerEmail}</div>
                </div>
                <div className="font-semibold text-ink">{formatPrice(order.total)}</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status]}`}>
                  {order.status}
                </span>
                <div className="text-[12px] text-ink-soft">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 stroke-ink-soft fill-none transition-transform ${expanded === order.id ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* Expanded detail */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-soft mb-3">Items</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between text-sm">
                            <span className="text-ink">{item.productName} × {item.quantity}</span>
                            <span className="text-ink-soft">{formatPrice(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Address + status */}
                    <div>
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-soft mb-2">Delivery Address</h4>
                      <p className="text-sm text-ink mb-5">{order.address}</p>
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-soft mb-2">Update Status</h4>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-sage-dark transition-colors capitalize disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                      {updating === order.id && <span className="text-xs text-ink-soft ml-2">Updating…</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="text-center py-16 text-ink-soft">No orders found.</div>
          )}
        </div>
      )}
    </div>
  );
}
