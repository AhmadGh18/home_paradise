'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article className="bg-cream rounded-[18px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_38px_rgba(46,52,45,0.14)] relative group">
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 z-10 bg-white text-terracotta text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => setWishlisted((w) => !w)}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1.5 group-hover:translate-y-0 transition-all duration-300"
          aria-label="Add to wishlist"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-terracotta stroke-terracotta' : 'fill-none stroke-ink'}`}
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
            className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-[22px] text-ink mb-1.5 hover:text-sage-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] text-ink-soft leading-snug mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[18px] font-semibold text-sage-dark">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <small className="text-[13px] font-normal text-ink-soft line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </small>
            )}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-ink text-white px-4 py-2.5 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-sage-dark hover:scale-105 transition-all duration-300"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 stroke-current fill-none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
