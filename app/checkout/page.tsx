"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
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
  const [orderError, setOrderError] = useState("");

  // Redirect if no items in cart
  if (state.items.length === 0 && !orderPlaced) {
    return (
      <StoreLayout>
        <div className="min-h-screen bg-cream flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <svg
              viewBox="0 0 24 24"
              className="w-20 h-20 mx-auto stroke-ink-soft fill-none mb-6"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" fill="currentColor" />
              <circle cx="20" cy="21" r="1" fill="currentColor" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1 className="font-serif text-3xl text-ink mb-3">Cart is Empty</h1>
            <p className="text-ink-soft mb-8">
              Add some beautiful things before checking out.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-sage-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-ink transition-all duration-300"
            >
              Continue Shopping
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
          items: state.items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          total: totalPrice,
        }),
      });

      if (res.ok) {
        clearCart();
        setOrderPlaced(true);
      } else {
        setOrderError("Failed to place order. Please try again.");
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
        <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sage-light to-sage-dark flex items-center justify-center shadow-lg mx-auto mb-8">
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 stroke-white fill-none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl text-ink mb-3">
              Order Confirmed!
            </h1>
            <p className="text-ink-soft text-lg mb-2">
              Thank you for your purchase.
            </p>
            <p className="text-ink-soft mb-10">
              We'll send tracking details to your email and phone shortly.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-sage-dark text-white px-10 py-3 rounded-full font-semibold hover:bg-ink transition-all duration-300 hover:shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="min-h-screen bg-cream py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-ink-soft mb-12">
            <Link
              href="/shop"
              className="hover:text-sage-dark transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-ink font-medium">Checkout</span>
          </div>

          <h1 className="font-serif text-5xl text-ink mb-12">Order Summary</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-white hover:border-sage-light/30 transition-colors">
                  <h2 className="font-serif text-2xl text-ink mb-6">
                    Shipping Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all bg-white"
                        placeholder="Jane Smith"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all bg-white"
                          placeholder="jane@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all bg-white"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form.address}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, address: e.target.value }))
                        }
                        className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all bg-white resize-none"
                        placeholder="12 Garden Lane, London, UK"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {orderError && (
                  <div className="bg-terracotta/10 border border-terracotta text-terracotta px-6 py-4 rounded-lg text-sm font-medium">
                    {orderError}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <Link
                    href="/shop"
                    className="flex-1 border-2 border-ink/20 py-4 px-6 rounded-lg text-center font-semibold text-ink hover:bg-cream hover:border-ink/40 transition-all"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-sage-dark text-white py-4 px-6 rounded-lg font-semibold hover:bg-ink hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    {submitting ? "Processing…" : "Place Order"}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-white sticky top-24">
                <h2 className="font-serif text-2xl text-ink mb-6">
                  Order Items
                </h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {state.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 pb-4 border-b border-beige last:border-0"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ink truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-ink-soft mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-bold text-sage-dark mt-2">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-beige pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="text-ink font-semibold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Shipping</span>
                    <span className="text-ink font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t border-beige">
                    <span className="font-bold text-ink">Total</span>
                    <span className="font-bold text-sage-dark text-xl">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
