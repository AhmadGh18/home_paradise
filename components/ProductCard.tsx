"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const stockStatus =
    product.stock > 10
      ? "In Stock"
      : product.stock > 0
        ? `Only ${product.stock} left`
        : "Out of Stock";
  const stockColor =
    product.stock > 10
      ? "text-sage-dark"
      : product.stock > 0
        ? "text-terracotta"
        : "text-ink-soft";

  return (
    <article className="bg-white rounded-[18px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(46,52,45,0.18)] relative group border border-transparent hover:border-sage-light/20">
      {/* Image */}
      <div className="aspect-square overflow-hidden relative bg-cream">
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 z-10 bg-terracotta text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-lg">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => setWishlisted((w) => !w)}
          className="absolute top-3.5 right-3.5 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-md hover:shadow-lg"
          aria-label="Add to wishlist"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-all ${wishlisted ? "fill-terracotta stroke-terracotta" : "fill-none stroke-ink hover:stroke-terracotta"}`}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-[20px] text-ink mb-1.5 hover:text-sage-dark transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] text-ink-soft leading-relaxed line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className={`w-3.5 h-3.5 ${i < 4 ? "fill-terracotta" : "fill-beige"}`}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-[12px] text-ink-soft font-medium">(24)</span>
        </div>

        {/* Stock Status */}
        <div className={`text-[12px] font-medium ${stockColor}`}>
          {stockStatus}
        </div>

        {/* Price and CTA */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-cream">
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-sage-dark">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <small className="text-[12px] font-medium text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </small>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 px-3 py-2.5 rounded-lg text-[12px] font-bold inline-flex items-center justify-center gap-1.5 transition-all duration-300 ${
              addedToCart
                ? "bg-sage-dark text-white"
                : product.stock === 0
                  ? "bg-beige text-ink-soft cursor-not-allowed"
                  : "bg-ink text-white hover:bg-sage-dark hover:scale-105 hover:shadow-lg active:scale-95"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current fill-none"
              strokeWidth={2}
            >
              {addedToCart ? (
                <path
                  d="M20 6 9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="20" cy="21" r="1" fill="currentColor" />
                  <path
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
            {addedToCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
