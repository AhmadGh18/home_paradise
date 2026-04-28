import Image from 'next/image';
import Link from 'next/link';
import StoreLayout from '@/components/StoreLayout';
import ProductCard from '@/components/ProductCard';
import NewsletterForm from '@/components/NewsletterForm';
import { getFeaturedProducts } from '@/lib/data';

const categories = [
  { id: 'cat-1', name: 'Flowers', slug: 'flowers', image: 'https://images.unsplash.com/photo-1587653263995-422546a7a569?auto=format&fit=crop&w=900&q=80', sub: 'Shop bouquets' },
  { id: 'cat-2', name: 'Plants', slug: 'plants', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=80', sub: 'Indoor & outdoor' },
  { id: 'cat-3', name: 'Soaps', slug: 'soaps', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=80', sub: 'Handcrafted' },
  { id: 'cat-4', name: 'Gifts', slug: 'gifts', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80', sub: 'Curated sets' },
];

const testimonials = [
  { name: 'Amelia K.', role: 'Verified buyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', quote: '"My monstera arrived so carefully packed. Two months in, it\'s thriving — and the handwritten note made my week."' },
  { name: 'Daniel R.', role: 'Verified buyer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', quote: '"The lavender soap smells like a garden in Provence. I\'ve re-ordered three times and gifted just as many."' },
  { name: 'Priya S.', role: 'Verified buyer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', quote: '"Everything feels considered — from the recycled kraft box to the dried eucalyptus tucked on top. Just beautiful."' },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <StoreLayout>
      {/* ── Hero ── */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center overflow-hidden text-white text-center"
        aria-label="Hero"
      >
        <div className="absolute inset-0 animate-kenburns">
          <Image
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=2000&q=80"
            alt="Lush garden"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 to-ink/50" />
        <div className="relative z-10 max-w-[720px] px-6 py-28 md:py-36 animate-rise">
          <span className="inline-block text-[13px] font-medium tracking-[3px] uppercase mb-5 opacity-90">
            Botanical Boutique
          </span>
          <h1 className="font-serif text-[clamp(44px,7vw,88px)] text-white font-medium mb-5 leading-[1.1]">
            Bring Nature <em className="italic text-sage-light">Home</em>
          </h1>
          <p className="text-[17px] max-w-[520px] mx-auto mb-9 opacity-90 leading-relaxed">
            Hand-picked flowers, living plants, and artisan soaps — thoughtfully crafted to turn every room into a moment of calm.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 bg-white text-ink px-9 py-4 rounded-full font-medium text-[15px] hover:bg-sage-dark hover:text-white hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            Shop Now
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-28 bg-cream" id="shop">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-3.5">Explore</span>
            <h2 className="font-serif text-[clamp(32px,4.5vw,52px)] max-w-[620px] mx-auto mb-3">Shop by Category</h2>
            <p className="text-ink-soft max-w-[560px] mx-auto text-base">
              A curated collection of greenery, gifts, and everyday luxuries — each one chosen with care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="relative rounded-[18px] overflow-hidden aspect-[3/4] cursor-pointer shadow-[0_6px_24px_rgba(46,52,45,0.08)] hover:-translate-y-2 hover:shadow-[0_14px_38px_rgba(46,52,45,0.14)] transition-all duration-300 group"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/60 flex flex-col justify-end p-6 text-white">
                  <h3 className="font-serif text-[28px] text-white mb-1.5">{cat.name}</h3>
                  <span className="text-[13px] opacity-85 flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300">
                    {cat.sub} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-3.5">Best Sellers</span>
            <h2 className="font-serif text-[clamp(32px,4.5vw,52px)] max-w-[620px] mx-auto mb-3">Loved by our customers</h2>
            <p className="text-ink-soft max-w-[560px] mx-auto text-base">
              The pieces our community keeps coming back for — refreshed weekly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-flex items-center gap-2 border border-ink/20 text-ink px-8 py-3.5 rounded-full text-sm font-medium hover:bg-ink hover:text-white transition-colors duration-300">
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-28 bg-cream-deep" id="about">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="rounded-[28px] overflow-hidden aspect-[4/5] shadow-[0_6px_24px_rgba(46,52,45,0.08)] relative">
              <Image
                src="https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=1000&q=80"
                alt="Florist arranging bouquet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div>
              <span className="inline-block text-[12px] tracking-[3px] uppercase text-terracotta font-medium mb-3.5">Our Story</span>
              <h2 className="font-serif text-[clamp(32px,4vw,48px)] mb-5">Handcrafted with love, delivered to your door.</h2>
              <p className="text-ink-soft text-base mb-4 leading-relaxed">
                HomeParadise began in a small sunlit greenhouse with one quiet belief — that homes feel more like home when nature lives in them. Every bouquet we wrap, every soap we pour, every plant we pot is finished by hand, by a small team who cares deeply about the detail.
              </p>
              <p className="text-ink-soft text-base mb-8 leading-relaxed">
                From a single clay pot to a hand-tied bouquet, each piece is a tiny act of care — from our makers to you.
              </p>
              <div className="flex gap-10 pt-8 border-t border-ink/10">
                {[['12k+', 'Happy homes'], ['250+', 'Curated pieces'], ['100%', 'Handcrafted']].map(([num, label]) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-serif text-[38px] font-semibold text-sage-dark leading-none">{num}</span>
                    <span className="text-[13px] text-ink-soft mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 bg-cream">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-3.5">Kind Words</span>
            <h2 className="font-serif text-[clamp(32px,4.5vw,52px)]">From our community</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-[960px] mx-auto">
            {testimonials.map((t) => (
              <article key={t.name} className="bg-white p-8 rounded-[18px] shadow-[0_6px_24px_rgba(46,52,45,0.08)] hover:-translate-y-1 transition-transform duration-300">
                <div className="flex gap-1 text-terracotta mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 2l3 7h7l-5.7 4.2 2.2 7L12 16l-6.5 4.2 2.2-7L2 9h7z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-[19px] italic leading-relaxed text-ink mb-6">{t.quote}</p>
                <div className="flex items-center gap-3.5">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full object-cover w-12 h-12" />
                  <div>
                    <div className="text-[15px] font-semibold text-ink">{t.name}</div>
                    <div className="text-[13px] text-ink-soft">{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 bg-sage-light">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 flex-wrap">
            <div>
              <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] text-ink mb-2.5">Join the garden.</h2>
              <p className="text-ink-soft text-[15px]">Early drops, seasonal guides, and 10% off your first order.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}


