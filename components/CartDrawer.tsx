'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

type CheckoutState = 'cart' | 'form' | 'success';

export default function CartDrawer() {
  const { state, dispatch, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } =
    useCart();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('cart');
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    dispatch({ type: 'CLOSE' });
    setCheckoutState('cart');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
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
        setCheckoutState('success');
        setForm({ name: '', email: '', address: '' });
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 z-40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/8">
          <h2 className="font-serif text-2xl text-ink">
            {checkoutState === 'form' ? 'Checkout' : checkoutState === 'success' ? 'Order placed' : `Your Cart (${totalItems})`}
          </h2>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full hover:bg-cream flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink fill-none" strokeWidth={1.8} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success */}
        {checkoutState === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-sage-dark fill-none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-ink">Thank you!</h3>
            <p className="text-ink-soft text-sm">Your order has been placed. We'll send a confirmation to your email shortly.</p>
            <button onClick={close} className="mt-2 bg-sage-dark text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-ink transition-colors">
              Continue Shopping
            </button>
          </div>
        )}

        {/* Checkout form */}
        {checkoutState === 'form' && (
          <form onSubmit={handleCheckout} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-ink mb-1.5">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark transition-colors bg-cream"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-ink mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark transition-colors bg-cream"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-ink mb-1.5">Delivery address</label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark transition-colors bg-cream resize-none"
                  placeholder="12 Garden Lane, London"
                />
              </div>
              {/* Order summary */}
              <div className="border border-beige rounded-xl p-4 space-y-2">
                <p className="text-[13px] font-semibold text-ink uppercase tracking-wide mb-3">Order summary</p>
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm text-ink-soft">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-beige pt-2 mt-2 flex justify-between font-semibold text-ink">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-ink/8 flex gap-3">
              <button
                type="button"
                onClick={() => setCheckoutState('cart')}
                className="flex-1 border border-beige py-3 rounded-full text-sm font-medium text-ink-soft hover:bg-cream transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-sage-dark text-white py-3 rounded-full text-sm font-medium hover:bg-ink transition-colors disabled:opacity-50"
              >
                {submitting ? 'Placing…' : 'Place Order'}
              </button>
            </div>
          </form>
        )}

        {/* Cart items */}
        {checkoutState === 'cart' && (
          <>
            {state.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-ink-soft fill-none" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5A2 2 0 0 1 7.5 18L6 7z" />
                  <path d="M9 7a3 3 0 1 1 6 0" />
                </svg>
                <p className="font-serif text-xl text-ink">Your cart is empty</p>
                <p className="text-sm text-ink-soft">Add some beautiful things.</p>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {state.items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 bg-cream">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
                      <p className="text-sm text-sage-dark font-semibold mt-0.5">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-beige flex items-center justify-center text-ink-soft hover:bg-cream transition-colors text-sm"
                          aria-label="Decrease"
                        >−</button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-beige flex items-center justify-center text-ink-soft hover:bg-cream transition-colors text-sm"
                          aria-label="Increase"
                        >+</button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-ink-soft hover:text-terracotta transition-colors self-start mt-1"
                      aria-label="Remove"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {state.items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink/8">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-ink-soft">Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(totalPrice)}</span>
                </div>
                <button
                  onClick={() => setCheckoutState('form')}
                  className="w-full bg-sage-dark text-white py-3.5 rounded-full font-medium hover:bg-ink transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
