"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/utils";

export default function CartDrawer() {
  const router = useRouter();
  const {
    state,
    dispatch,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  const close = () => dispatch({ type: "CLOSE" });

  const handleCheckout = () => {
    close();
    router.push("/checkout");
  };

  // Lock background scroll and close on Escape while the drawer is open.
  useEffect(() => {
    if (!state.isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE" });
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [state.isOpen, dispatch]);

  if (!state.isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/40 z-40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8 bg-gradient-to-r from-cream to-cream-deep">
          <h2 className="font-serif text-[22px] text-ink">
            Cart ({totalItems})
          </h2>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center transition-all duration-300 hover:shadow-md active:scale-95"
            aria-label="Close cart"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-ink fill-none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 py-12 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-cream-deep flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 stroke-ink-soft fill-none"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" fill="currentColor" />
                <circle cx="20" cy="21" r="1" fill="currentColor" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-[20px] text-ink mb-1">
                Cart is Empty
              </p>
              <p className="text-[13px] text-ink-soft">
                Start adding products to get started.
              </p>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-3 divide-y divide-beige">
              {state.items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-3 py-3 first:pt-0"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0 bg-cream border border-beige/50">
                    <Image
                      src={item.product.image || PLACEHOLDER_IMAGE}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-ink truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[13px] text-sage-dark font-bold mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded border border-beige flex items-center justify-center text-ink-soft hover:bg-cream hover:border-sage-light transition-colors text-sm font-bold"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="text-[13px] font-semibold w-5 text-center text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 rounded border border-beige flex items-center justify-center text-ink-soft hover:bg-cream hover:border-sage-light transition-colors text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-ink-soft hover:text-terracotta transition-all hover:scale-125 self-start mt-1"
                    aria-label="Remove"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 stroke-current fill-none"
                      strokeWidth={2}
                      strokeLinecap="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="px-6 py-5 border-t border-ink/8 bg-gradient-to-r from-cream to-cream-deep space-y-4">
              <div className="flex justify-between pb-3 border-b border-ink/10">
                <span className="text-[13px] text-ink-soft font-medium">
                  Subtotal
                </span>
                <span className="font-bold text-ink">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-sage-dark text-white py-3 rounded-lg font-bold text-[13px] hover:bg-ink hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={close}
                className="w-full border border-ink/20 text-ink py-3 rounded-lg font-semibold text-sm hover:bg-cream transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
