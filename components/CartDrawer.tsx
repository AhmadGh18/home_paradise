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
        className="animate-fade fixed inset-0 z-40 bg-ink/40"
        onClick={close}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="animate-drawer fixed right-0 top-0 z-50 flex h-dvh w-full flex-col bg-cream sm:w-[440px]"
      >
        <div className="flex items-center justify-between border-b border-beige px-6 py-5">
          <h2 className="font-serif text-[26px] text-ink">
            Your cart{" "}
            <span className="font-sans text-[15px] tabular-nums text-ink-soft">
              ({totalItems})
            </span>
          </h2>
          <button
            onClick={close}
            className="flex h-10 w-10 items-center justify-center transition-colors duration-200 hover:text-terracotta"
            aria-label="Close cart"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current"
              strokeWidth={1.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-[28px] text-ink">
              Nothing here <em>yet.</em>
            </p>
            <p className="mb-7 mt-2 text-[15px] text-ink-soft">
              Your cart is waiting for something green.
            </p>
            <button onClick={close} className="btn-secondary">
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-beige overflow-y-auto px-6">
              {state.items.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream-deep">
                    <Image
                      src={item.product.image || PLACEHOLDER_IMAGE}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <p className="font-serif text-[18px] leading-snug text-ink">
                        {item.product.name}
                      </p>
                      <p className="shrink-0 text-[15px] tabular-nums text-ink">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-beige">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-11 w-11 items-center justify-center text-ink transition-colors duration-200 hover:bg-cream-deep sm:h-9 sm:w-9"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-[14px] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="flex h-11 w-11 items-center justify-center text-ink transition-colors duration-200 hover:bg-cream-deep disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent sm:h-9 sm:w-9"
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="link-underline py-2.5 text-[13px] text-ink-soft"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-beige px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-[15px] text-ink-soft">Subtotal</span>
                <span className="font-serif text-[24px] tabular-nums text-ink">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full">
                Go to checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
