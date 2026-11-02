import Image from "next/image";
import Link from "next/link";
import FadeImage from "@/components/FadeImage";
import StoreLayout from "@/components/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { listCategories } from "@/lib/repo/categories";
import { listProducts } from "@/lib/repo/products";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MARQUEE_WORDS = ["Flowers", "Plants", "Soaps", "Gifts"];

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} fill-none stroke-current`}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  // Featured items first, topped up with the newest so the row is never sparse.
  const highlights = [
    ...products.filter((p) => p.featured),
    ...products.filter((p) => !p.featured),
  ].slice(0, 4);

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="overflow-hidden border-b border-beige">
        <div className="page-width grid items-end gap-10 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="pb-4 lg:col-span-7 lg:pb-20">
            <p className="eyebrow rise mb-6">Flowers, plants, soaps &amp; gifts</p>
            <h1 className="rise rise-2 font-serif text-[clamp(56px,10.5vw,148px)] leading-[0.95] tracking-[-0.03em] text-ink">
              Bring nature <em className="text-sage">home.</em>
            </h1>
            <p className="rise rise-3 mt-8 max-w-[46ch] text-[18px] leading-relaxed text-ink-soft">
              Hand-picked flowers, living plants, and artisan soaps, thoughtfully
              crafted to turn every room into a moment of calm.
            </p>
            <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/shop" className="btn-primary group">
                Shop the collection
                <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link href="/#about" className="link-underline text-[15px]">
                Our story
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px] lg:col-span-5 lg:max-w-none">
            {/* The sun from the logo, rising behind the doorway. */}
            <div
              className="sun-enter absolute -right-6 top-2 h-24 w-24 sm:-right-8 sm:h-32 sm:w-32"
              aria-hidden="true"
            >
              <div className="sun-drift relative h-full w-full rounded-full bg-terracotta-soft">
                <svg
                  viewBox="0 0 100 100"
                  className="sun-rays absolute -inset-[24%] h-[148%] w-[148%] stroke-terracotta-soft"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <line key={i} x1="50" y1="3" x2="50" y2="11" transform={`rotate(${i * 30} 50 50)`} />
                  ))}
                </svg>
              </div>
            </div>
            <div className="rise rise-2 arch relative aspect-[4/5] overflow-hidden bg-cream-deep">
              <div className="hero-drift absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1558293842-c0fd3db86157?auto=format&fit=crop&w=1200&q=80"
                  alt="A sunlit garden path under flowering wisteria"
                  fill
                  priority
                  className="hero-image object-cover"
                  sizes="(max-width: 1024px) 480px, 42vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-width py-20 lg:py-28">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 lg:mb-16">
          <div>
            <p className="eyebrow mb-4">The collection</p>
            <h2 className="max-w-[17ch] font-serif text-[clamp(38px,5vw,72px)] leading-[1.02] text-ink">
              Find what your home{" "}
              <em className="whitespace-nowrap text-sage">is missing.</em>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 pb-2 text-[15px] transition-colors duration-200 hover:text-terracotta"
          >
            Shop everything <Arrow />
          </Link>
        </div>

        {/* A row of arched windows; every second one sits lower for rhythm. */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <li
              key={cat.id}
              className={`reveal ${index % 2 === 1 ? "mt-10 lg:mt-14" : ""}`}
            >
              <Link href={`/shop?category=${cat.slug}`} className="group block">
                <div className="arch relative aspect-[3/4] overflow-hidden bg-cream-deep">
                  <FadeImage
                    src={cat.image || PLACEHOLDER_IMAGE}
                    alt=""
                    fill
                    className="object-cover transition-[opacity,scale] duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 pt-4">
                  <div className="min-w-0">
                    <h3 className="font-serif text-[clamp(24px,2.4vw,34px)] leading-tight text-ink transition-colors duration-200 group-hover:text-terracotta">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[14px] leading-snug text-ink-soft">
                      {cat.description}
                    </p>
                  </div>
                  <Arrow className="mt-2 h-5 w-5 shrink-0 text-ink transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="bg-cream-deep/60 py-20 lg:py-28">
          <div className="page-width">
            <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4 lg:mb-14">
              <div>
                <p className="eyebrow mb-4">In the shop now</p>
                <h2 className="font-serif text-[clamp(38px,4.6vw,64px)] text-ink">
                  Our current <em>favourites</em>
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 pb-2 text-[15px] transition-colors duration-200 hover:text-terracotta"
              >
                View everything <Arrow />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {highlights.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Story */}
      <section id="about" className="scroll-mt-20 bg-sage-dark text-cream">
        <div className="page-width grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
          <div className="reveal relative mx-auto w-full max-w-[440px] lg:col-span-5 lg:mx-0">
            <div className="arch relative aspect-[4/5] overflow-hidden bg-sage">
              <div className="image-drift absolute inset-0">
                <FadeImage
                  src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1000&q=80"
                  alt="A hand-tied bouquet of garden roses and foliage"
                  fill
                  className="object-cover transition-opacity duration-700"
                  sizes="(max-width: 1024px) 440px, 36vw"
                />
              </div>
            </div>
          </div>
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.16em] text-terracotta-soft">
              Our story
            </p>
            <h2 className="font-serif text-[clamp(36px,4.6vw,64px)]">
              It began in a small, <em className="text-terracotta-soft">sunlit</em>{" "}
              greenhouse.
            </h2>
            <div className="mt-8 max-w-[56ch] space-y-5 text-[17px] leading-relaxed text-cream/85">
              <p>
                HomeParadise started with one quiet belief: homes feel more like
                home when nature lives in them. Every bouquet we wrap, every soap
                we pour, every plant we pot is finished by hand, by a small team
                who care deeply about the detail.
              </p>
              <p>
                From a single clay pot to a hand-tied bouquet, each piece is a
                tiny act of care, from our makers to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative: the same names are real links in the collection above. */}
      <div
        aria-hidden="true"
        className="marquee overflow-hidden border-b border-beige py-5 sm:py-7"
      >
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 font-serif text-[clamp(36px,5vw,72px)] italic leading-none text-sage sm:px-10">
                    {MARQUEE_WORDS[i % MARQUEE_WORDS.length]}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-terracotta-soft sm:h-3 sm:w-3" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Closing prompt */}
      <section className="page-width flex flex-col items-start justify-between gap-8 py-20 lg:flex-row lg:items-end lg:py-28">
        <h2 className="reveal max-w-[16ch] font-serif text-[clamp(38px,5vw,72px)] text-ink">
          Have something <em className="text-sage">special</em> in mind?
        </h2>
        <div className="reveal max-w-[38ch]">
          <p className="mb-6 text-[17px] leading-relaxed text-ink-soft">
            Tell us about the occasion or the room, and we&apos;ll help you find
            the right piece, or put together a custom bouquet.
          </p>
          <Link href="/contact" className="btn-secondary">
            Talk to us
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
