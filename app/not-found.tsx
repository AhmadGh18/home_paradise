import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";

export default function NotFound() {
  return (
    <StoreLayout>
      <div className="page-width flex min-h-[70vh] flex-col justify-center py-20">
        <p className="eyebrow mb-5">Page not found</p>
        <h1 className="max-w-[14ch] font-serif text-[clamp(48px,8vw,104px)] leading-[0.98] tracking-[-0.03em] text-ink">
          This path <em className="text-sage">leads nowhere.</em>
        </h1>
        <p className="mt-6 text-[18px] text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Browse the shop
          </Link>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </StoreLayout>
  );
}
