"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/utils";
import StoreLayout from "@/components/StoreLayout";

export default function CheckoutPage() {
  const { state, clearCart, totalPrice } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderError, setOrderError] = useState("");

  if (state.items.length === 0 && !orderPlaced) {
    return (
      <StoreLayout>
        <div className="page-width flex min-h-[70vh] flex-col justify-center py-20">
          <h1 className="font-serif text-[clamp(48px,8vw,104px)] leading-[0.98] tracking-[-0.03em] text-ink">
            Your cart is <em className="text-sage">empty.</em>
          </h1>
          <p className="mb-9 mt-6 text-[18px] text-ink-soft">
            Add something beautiful before checking out.
          </p>
          <div>
            <Link href="/shop" className="btn-primary">
              Browse the shop
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          // Prices and totals are resolved server-side from the database; we
          // only send which product and how many.
          items: state.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setOrderId(data?.id ?? "");
        clearCart();
        setOrderPlaced(true);
      } else {
        setOrderError(
          data?.error || "Failed to place order. Please try again.",
        );
      }
    } catch {
      setOrderError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <StoreLayout>
        <div className="page-width flex min-h-[70vh] flex-col justify-center py-20">
          <p className="eyebrow mb-5">Order received</p>
          <h1 className="font-serif text-[clamp(48px,8vw,104px)] leading-[0.98] tracking-[-0.03em] text-ink">
            Thank you<em className="text-sage">.</em>
          </h1>
          <p className="mt-6 max-w-[48ch] text-[18px] leading-relaxed text-ink-soft">
            We&apos;ve received your order and will be in touch using the details
            you gave us.
          </p>
          {orderId && (
            <p className="mt-6 text-[14px] text-ink-soft">
              Order reference
              <span className="mt-1 block break-all font-mono text-[14px] text-ink">
                {orderId}
              </span>
            </p>
          )}
          <div className="mt-9">
            <Link href="/" className="btn-primary">
              Back to home
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="page-width pb-24 pt-12 lg:pt-16">
        <h1 className="mb-12 font-serif text-[clamp(44px,6vw,80px)] leading-[0.98] tracking-[-0.025em] text-ink">
          Checkout
        </h1>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-7">
            <h2 className="mb-6 border-t border-ink/80 pt-5 font-serif text-[26px] text-ink">
              Where should we send it?
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="field-label">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="field"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="field-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="field-label">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="field-label">
                  Delivery address
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  className="field resize-none"
                />
              </div>
            </div>

            {orderError && (
              <p
                role="alert"
                className="mt-6 border-l-2 border-terracotta bg-terracotta/10 px-4 py-3 text-[15px] text-ink"
              >
                {orderError}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full sm:w-auto"
              >
                {/* On phones the summary sits below this button, so show the total. */}
                {submitting
                  ? "Placing your order…"
                  : `Place order · ${formatPrice(totalPrice)}`}
              </button>
              <Link href="/shop" className="link-underline text-[15px]">
                Keep shopping
              </Link>
            </div>
          </form>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="bg-cream-deep/60 p-6 lg:sticky lg:top-28">
              <h2 className="mb-2 font-serif text-[26px] text-ink">
                Your order
              </h2>

              <ul className="max-h-96 divide-y divide-beige overflow-y-auto">
                {state.items.map((item) => (
                  <li key={item.product.id} className="flex gap-4 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream-deep">
                      <Image
                        src={item.product.image || PLACEHOLDER_IMAGE}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-[17px] leading-snug text-ink">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-[13px] text-ink-soft">
                        Quantity {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] tabular-nums text-ink">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 border-t border-beige pt-4 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(totalPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Delivery</dt>
                  <dd>Free</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink/80 pt-3">
                  <dt className="font-medium text-ink">Total</dt>
                  <dd className="font-serif text-[26px] tabular-nums text-ink">
                    {formatPrice(totalPrice)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}
