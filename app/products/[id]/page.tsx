import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoreLayout from "@/components/StoreLayout";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "./AddToCartButton";
import { findProductById, listProducts } from "@/lib/repo/products";
import type { Product } from "@/lib/types";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) return { title: "Product not found — HomeParadise" };

  const title = `${product.name} — HomeParadise`;
  const description = product.description || "Bring nature home with HomeParadise.";
  const images = product.image ? [{ url: product.image }] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images, type: "website" },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await findProductById(id);

  if (!product) notFound();

  const related = (await listProducts({ categoryId: product.categoryId }))
    .filter((p: Product) => p.id !== product.id)
    .slice(0, 4);

  return (
    <StoreLayout>
      <section className="page-width grid gap-8 pb-20 pt-6 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep lg:col-span-7">
          {product.badge && (
            <span className="absolute left-0 top-4 z-10 bg-cream px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
              {product.badge}
            </span>
          )}
          <Image
            src={product.image || PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-[13px] text-ink-soft">
              <Link href="/shop" className="link-underline">
                Shop
              </Link>
              {product.categoryName && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{product.categoryName}</span>
                </>
              )}
            </nav>

            <h1 className="font-serif text-[clamp(40px,4.4vw,64px)] leading-[1.02] tracking-[-0.02em] text-ink">
              {product.name}
            </h1>

            <div className="mt-5 flex items-baseline gap-3 text-[22px] tabular-nums text-ink">
              {formatPrice(product.price)}
              {product.originalPrice && (
                <s className="text-[16px] text-ink-soft">
                  {formatPrice(product.originalPrice)}
                </s>
              )}
            </div>

            <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
              {product.description}
            </p>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            {product.details && (
              <div className="mt-8 border-t border-beige pt-6">
                <h2 className="mb-3 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink">
                  The details
                </h2>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  {product.details}
                </p>
              </div>
            )}

            <ul className="mt-8 divide-y divide-beige border-y border-beige text-[14px] text-ink-soft">
              {["Sustainably sourced", "Plastic-free packaging", "Free delivery"].map(
                (label) => (
                  <li key={label} className="py-3">
                    {label}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-beige py-20">
          <div className="page-width">
            <h2 className="mb-10 font-serif text-[clamp(32px,3.6vw,48px)] text-ink">
              You might <em>also</em> like
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </StoreLayout>
  );
}
