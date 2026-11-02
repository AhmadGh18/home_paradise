'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Category, Product } from '@/lib/types';

interface Props {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ShopClient({
  products,
  categories,
  initialCategory = 'all',
}: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.categoryId === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName ?? '').toLowerCase().includes(q),
      );
    }

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return list;
  }, [products, activeCategory, search, sortBy]);

  const active = categories.find((c) => c.id === activeCategory);
  const tabs = [{ id: 'all', name: 'Everything' }, ...categories];

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('all');
  };

  return (
    <div className="page-width min-h-[70vh] pb-24 pt-12 lg:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 pb-10">
        <h1 className="font-serif text-[clamp(52px,8vw,112px)] leading-[0.95] tracking-[-0.03em] text-ink">
          {active ? active.name : 'The shop'}
        </h1>
        <p className="max-w-[36ch] pb-2 text-[16px] leading-relaxed text-ink-soft">
          {active?.description || 'Flowers, plants, soaps and gifts, curated with care.'}
        </p>
      </header>

      {/* Filters */}
      {/* Sticky only on large screens: on a phone it would cover a quarter of the view. */}
      <div className="z-20 -mx-5 mb-10 border-y border-beige bg-cream/95 px-5 backdrop-blur sm:-mx-8 sm:px-8 lg:sticky lg:top-[72px] lg:mx-0 lg:px-0">
        <div className="flex flex-col gap-x-8 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter by category"
            className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none]"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                aria-pressed={activeCategory === tab.id}
                className={`shrink-0 border-b-2 py-4 text-[15px] transition-colors duration-200 ${
                  activeCategory === tab.id
                    ? 'border-terracotta text-ink'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 border-t border-beige py-2 lg:border-0 lg:py-0">
            <label className="flex min-w-0 flex-1 items-center gap-2 lg:w-52 lg:flex-none">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-ink-soft"
                strokeWidth={1.5}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:text-ink-soft"
              />
            </label>
            <label className="shrink-0">
              <span className="sr-only">Sort products</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="cursor-pointer bg-transparent py-2.5 text-[15px] text-ink outline-none"
              >
                <option value="default">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <p className="mb-6 text-[14px] text-ink-soft" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="py-24 text-center" aria-live="polite">
          <p className="font-serif text-[32px] text-ink">
            Nothing matches <em>that.</em>
          </p>
          <p className="mb-7 mt-2 text-[15px] text-ink-soft">
            Try a different word or look through everything.
          </p>
          <button onClick={clearFilters} className="btn-secondary">
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}
