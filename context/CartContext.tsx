'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'SYNC'; products: Product[] };

/** Clamp a desired quantity to what the product actually has in stock. */
function clampQty(quantity: number, stock: number): number {
  return Math.max(0, Math.min(quantity, stock));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const { product } = action;
      if (product.stock <= 0) return state;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        const quantity = clampQty(existing.quantity + 1, product.stock);
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity } : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product, quantity: 1 }],
      };
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case 'UPDATE_QTY': {
      return {
        ...state,
        items: state.items.flatMap((i) => {
          if (i.product.id !== action.productId) return [i];
          const quantity = clampQty(action.quantity, i.product.stock);
          return quantity <= 0 ? [] : [{ ...i, quantity }];
        }),
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'SYNC': {
      // Replace stored product snapshots with fresh server data, dropping
      // items whose product no longer exists and clamping quantities to stock.
      const byId = new Map(action.products.map((p) => [p.id, p]));
      return {
        ...state,
        items: state.items.flatMap((i) => {
          const fresh = byId.get(i.product.id);
          if (!fresh) return [];
          const quantity = clampQty(i.quantity, fresh.stock);
          return quantity <= 0 ? [] : [{ product: fresh, quantity }];
        }),
      };
    }
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage, then refresh snapshots against the server so
  // stale prices / names / stock (or deleted products) can't linger in the cart.
  useEffect(() => {
    let items: CartItem[] = [];
    try {
      const saved = localStorage.getItem('hp-cart');
      if (saved) {
        items = JSON.parse(saved) as CartItem[];
        dispatch({ type: 'HYDRATE', items });
      }
    } catch {
      // ignore malformed storage
    }

    const ids = items.map((i) => i.product?.id).filter(Boolean);
    if (ids.length === 0) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/products?ids=${ids.join(',')}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const products = (await res.json()) as Product[];
        dispatch({ type: 'SYNC', products });
      } catch {
        // offline or aborted — keep the cached snapshot
      }
    })();
    return () => controller.abort();
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('hp-cart', JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD', product });
    dispatch({ type: 'OPEN' });
  };
  const removeFromCart = (productId: string) =>
    dispatch({ type: 'REMOVE', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QTY', productId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
