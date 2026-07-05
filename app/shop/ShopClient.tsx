'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product, Category } from '@/lib/types';

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
      const q = search.toLowerCase();
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

  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-cream-deep py-16">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-3">The Collection</span>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] text-ink">Shop All</h1>
          <p className="text-ink-soft mt-3 max-w-md mx-auto">
            Flowers, plants, soaps, and gifts — curated with care.
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 py-12">
        {/* Filters toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 stroke-ink-soft fill-none"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-11 pr-4 py-3 rounded-full border border-beige bg-white text-sm outline-none focus:border-sage-dark transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-beige bg-white rounded-full px-5 py-3 text-sm text-ink-soft outline-none focus:border-sage-dark transition-colors cursor-pointer"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-ink text-white'
                : 'bg-white border border-beige text-ink-soft hover:border-ink/30'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-ink text-white'
                  : 'bg-white border border-beige text-ink-soft hover:border-ink/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-[13px] text-ink-soft mb-6">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {activeCategory !== 'all' && ` in ${categories.find((c) => c.id === activeCategory)?.name}`}
          {search && ` for "${search}"`}
        </p>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-ink-soft fill-none mx-auto mb-4" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <p className="font-serif text-2xl text-ink mb-2">No products found</p>
            <p className="text-ink-soft text-sm">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
