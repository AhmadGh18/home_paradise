import Image from "next/image";
import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";
import { getFeaturedProducts } from "@/lib/data";

const categories = [
  {
    id: "cat-1",
    name: "Flowers",
    slug: "flowers",
    image:
      "https://images.unsplash.com/photo-1587653263995-422546a7a569?auto=format&fit=crop&w=900&q=80",
    sub: "Shop bouquets",
  },
  {
    id: "cat-2",
    name: "Plants",
    slug: "plants",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=80",
    sub: "Indoor & outdoor",
  },
  {
    id: "cat-3",
    name: "Soaps",
    slug: "soaps",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=80",
    sub: "Handcrafted",
  },
  {
    id: "cat-4",
    name: "Gifts",
    slug: "gifts",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
    sub: "Curated sets",
  },
];

const testimonials = [
  {
    name: "Amelia K.",
    role: "Verified buyer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      '"My monstera arrived so carefully packed. Two months in, it\'s thriving — and the handwritten note made my week."',
  },
  {
    name: "Daniel R.",
    role: "Verified buyer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    quote:
      '"The lavender soap smells like a garden in Provence. I\'ve re-ordered three times and gifted just as many."',
  },
  {
    name: "Priya S.",
    role: "Verified buyer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    quote:
      '"Everything feels considered — from the recycled kraft box to the dried eucalyptus tucked on top. Just beautiful."',
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();
  console.log("all project : ", featured);

  return (
    <StoreLayout>
      {/* ── Hero ── */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden text-white text-center"
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
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/60" />
        <div className="relative z-10 max-w-[760px] px-6 py-32 md:py-40 animate-rise">
          <span className="inline-block text-[12px] font-bold tracking-[4px] uppercase mb-6 opacity-95 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            Botanical Boutique
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,96px)] text-white font-medium mb-6 leading-[1.08]">
            Bring Nature{" "}
            <em className="italic text-sage-light not-italic font-serif">
              Home
            </em>
          </h1>
          <p className="text-[16px] max-w-[540px] mx-auto mb-10 opacity-95 leading-relaxed font-light">
            Hand-picked flowers, living plants, and artisan soaps — thoughtfully
            crafted to turn every room into a moment of calm.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-ink px-10 py-4 rounded-full font-bold text-[15px] hover:bg-sage-light hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <span>Shop Now</span>
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current fill-none"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-32 bg-cream" id="shop">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-header">Shop</span>
            <h2 className="font-serif text-[clamp(36px,5vw,56px)] max-w-[620px] mx-auto mb-4 text-ink">
              Shop by Category
            </h2>
            <p className="text-ink-soft max-w-[580px] mx-auto text-base leading-relaxed">
              A curated collection of greenery, gifts, and everyday luxuries —
              each one chosen with care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-[0_8px_32px_rgba(46,52,45,0.1)] hover:-translate-y-3 hover:shadow-[0_16px_48px_rgba(46,52,45,0.16)] transition-all duration-300 group border border-white/50"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-transparent via-60% to-black/70 flex flex-col justify-end p-6 text-white">
                  <h3 className="font-serif text-[30px] text-white mb-2 font-semibold">
                    {cat.name}
                  </h3>
                  <span className="text-[13px] opacity-90 flex items-center gap-2 group-hover:gap-3 transition-all duration-300 font-medium">
                    {cat.sub}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-32 bg-white">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-header">Bestsellers</span>
            <h2 className="font-serif text-[clamp(36px,5vw,56px)] max-w-[620px] mx-auto mb-4 text-ink">
              Loved by our community
            </h2>
            <p className="text-ink-soft max-w-[580px] mx-auto text-base leading-relaxed">
              The pieces our community keeps coming back for — refreshed weekly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 border-2 border-ink/20 text-ink px-9 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-ink hover:text-white hover:border-ink transition-all duration-300 active:scale-95"
            >
              View All Products
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-current fill-none"
                strokeWidth={2.5}
                strokeLinecap="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-32 bg-cream-deep" id="about">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_12px_48px_rgba(46,52,45,0.12)] relative order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=1000&q=80"
                alt="Florist arranging bouquet"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block text-[11px] font-bold tracking-[3px] uppercase text-terracotta mb-4 bg-terracotta-soft/20 px-3.5 py-1.5 rounded-full">
                Our Story
              </span>
              <h2 className="font-serif text-[clamp(32px,4vw,52px)] mb-6 text-ink leading-tight">
                Handcrafted with love, delivered to your door.
              </h2>
              <p className="text-ink-soft text-[15px] mb-5 leading-relaxed">
                HomeParadise began in a small sunlit greenhouse with one quiet
                belief — that homes feel more like home when nature lives in
                them. Every bouquet we wrap, every soap we pour, every plant we
                pot is finished by hand, by a small team who cares deeply about
                the detail.
              </p>
              <p className="text-ink-soft text-[15px] mb-10 leading-relaxed">
                From a single clay pot to a hand-tied bouquet, each piece is a
                tiny act of care — from our makers to you.
              </p>
              <div className="flex gap-12 pt-8 border-t-2 border-ink/10">
                {[
                  ["12k+", "Happy homes"],
                  ["250+", "Curated pieces"],
                  ["100%", "Handcrafted"],
                ].map(([num, label]) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-serif text-[42px] font-bold text-sage-dark leading-none">
                      {num}
                    </span>
                    <span className="text-[12px] text-ink-soft mt-2 font-medium">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-32 bg-cream">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-header">Reviews</span>
            <h2 className="font-serif text-[clamp(36px,5vw,56px)] text-ink">
              Loved by our customers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1020px] mx-auto">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="bg-white p-8 rounded-2xl shadow-[0_6px_24px_rgba(46,52,45,0.08)] hover:-translate-y-2 hover:shadow-[0_12px_48px_rgba(46,52,45,0.12)] transition-all duration-300 border border-white hover:border-sage-light/30"
              >
                <div className="flex gap-1.5 text-terracotta mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current"
                    >
                      <path d="M12 2l3 7h7l-5.7 4.2 2.2 7L12 16l-6.5 4.2 2.2-7L2 9h7z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-[18px] italic leading-relaxed text-ink mb-7">
                  {t.quote}
                </p>
                <div className="flex items-center gap-4 pt-5 border-t border-beige">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12 flex-shrink-0"
                  />
                  <div>
                    <div className="text-[14px] font-bold text-ink">
                      {t.name}
                    </div>
                    <div className="text-[12px] text-ink-soft font-medium">
                      {t.role}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-24 bg-gradient-to-br from-sage-light to-sage-light/80">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="font-serif text-[clamp(32px,4vw,48px)] text-ink mb-3">
                Join the garden.
              </h2>
              <p className="text-ink-soft text-[15px] font-medium">
                Early access, seasonal guides, and 10% off your first order.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
