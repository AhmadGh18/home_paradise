import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";

export default function NotFound() {
  return (
    <StoreLayout>
      <div className="min-h-[70vh] flex items-center justify-center bg-cream px-6">
        <div className="text-center max-w-md">
          <p className="font-serif text-[80px] leading-none text-sage-dark mb-2">
            404
          </p>
          <h1 className="font-serif text-3xl text-ink mb-3">Page not found</h1>
          <p className="text-ink-soft mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-sage-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-ink transition-colors"
            >
              Back home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border-2 border-ink/20 text-ink px-8 py-3 rounded-full font-semibold hover:bg-cream-deep transition-colors"
            >
              Browse shop
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
