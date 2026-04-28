'use client';

import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      disabled={product.stock === 0}
      className="w-full bg-ink text-white py-4 rounded-full font-medium text-base flex items-center justify-center gap-2.5 hover:bg-sage-dark transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 stroke-current fill-none"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5A2 2 0 0 1 7.5 18L6 7z" />
        <path d="M9 7a3 3 0 1 1 6 0" />
      </svg>
      {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
    </button>
  );
}
