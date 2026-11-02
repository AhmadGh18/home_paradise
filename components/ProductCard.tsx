"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LinkPendingBar from "@/components/LinkPendingBar";
import { useCart } from "@/context/CartContext";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep">
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0"
          aria-label={product.name}
        >
          <Image
            src={product.image || PLACEHOLDER_IMAGE}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${soldOut ? "opacity-60 grayscale-[35%]" : ""}`}
          />
          <LinkPendingBar />
        </Link>

        {(product.badge || soldOut) && (
          <span className="pointer-events-none absolute left-0 top-3 bg-cream px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
            {soldOut ? "Sold out" : product.badge}
          </span>
        )}

        {!soldOut && (
          <>
            {/* Desktop: a bar that appears on hover. */}
            <button
              onClick={handleAdd}
              className={`absolute inset-x-0 bottom-0 hidden translate-y-full py-3 text-[14px] font-medium transition-all duration-200 group-hover:translate-y-0 focus-visible:translate-y-0 lg:block ${
                added
                  ? "bg-terracotta text-cream"
                  : "bg-sage-dark/95 text-cream hover:bg-ink"
              }`}
            >
              {added ? "Added" : "Add to cart"}
            </button>
            {/* Touch screens have no hover, and a bar would cover the photo. */}
            <button
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 lg:hidden ${
                added ? "bg-terracotta text-cream" : "bg-sage-dark text-cream"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {added ? <path d="M5 12l5 5L20 7" /> : <path d="M12 5v14M5 12h14" />}
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 pt-3.5">
        <div className="min-w-0">
          <h3 className="font-serif text-[18px] leading-snug text-ink sm:text-[20px]">
            <Link
              href={`/products/${product.id}`}
              className="transition-colors duration-200 hover:text-terracotta"
            >
              {product.name}
              <LinkPendingBar />
            </Link>
          </h3>
        </div>
        <div className="shrink-0 text-right text-[15px] tabular-nums text-ink">
          {formatPrice(product.price)}
          {product.originalPrice && (
            <s className="block text-[13px] text-ink-soft">
              {formatPrice(product.originalPrice)}
            </s>
          )}
        </div>
      </div>
    </article>
  );
}
