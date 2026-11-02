'use client';

import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      disabled={product.stock === 0}
      className="btn-primary w-full"
    >
      {product.stock === 0 ? 'Sold out' : 'Add to cart'}
    </button>
  );
}
