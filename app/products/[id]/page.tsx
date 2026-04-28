import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoreLayout from '@/components/StoreLayout';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from './AddToCartButton';
import { getProductById, getProducts } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <StoreLayout>
      {/* Breadcrumb */}
      <nav className="max-w-[1240px] mx-auto px-6 pt-8 pb-2 text-[13px] text-ink-soft flex items-center gap-2">
        <Link href="/" className="hover:text-sage-dark transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-sage-dark transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      {/* Product detail */}
      <section className="max-w-[1240px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-square rounded-[28px] overflow-hidden shadow-[0_6px_24px_rgba(46,52,45,0.1)]">
            {product.badge && (
              <span className="absolute top-5 left-5 z-10 bg-white text-terracotta text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.categoryName && (
              <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-4">
                {product.categoryName}
              </span>
            )}
            <h1 className="font-serif text-[clamp(36px,4vw,52px)] text-ink mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[28px] font-semibold text-sage-dark">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[18px] text-ink-soft line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <p className="text-base text-ink-soft leading-relaxed mb-4">
              {product.description}
            </p>
            {product.details && (
              <p className="text-sm text-ink-soft leading-relaxed mb-8 border-t border-beige pt-5">
                {product.details}
              </p>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 5 ? 'bg-sage' : product.stock > 0 ? 'bg-terracotta-soft' : 'bg-red-400'}`} />
              <span className="text-ink-soft">
                {product.stock > 5
                  ? 'In stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of stock'}
              </span>
            </div>

            <AddToCartButton product={product} />

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-beige">
              {[
                { icon: '🌿', label: 'Sustainably sourced' },
                { icon: '📦', label: 'Plastic-free packaging' },
                { icon: '🚚', label: 'Free delivery over $60' },
              ].map(({ icon, label }) => (
                <div key={label} className="text-center text-[12px] text-ink-soft leading-snug">
                  <span className="text-xl block mb-1">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream-deep py-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] text-ink mb-10 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </StoreLayout>
  );
}
