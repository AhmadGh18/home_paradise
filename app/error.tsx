"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-width flex min-h-[70vh] flex-col justify-center py-20">
      <h1 className="max-w-[14ch] font-serif text-[clamp(44px,7vw,88px)] leading-[1] tracking-[-0.02em] text-ink">
        Something <em className="text-terracotta">went wrong.</em>
      </h1>
      <p className="mb-9 mt-6 text-[18px] text-ink-soft">
        We hit an unexpected error. Please try again in a moment.
      </p>
      <div>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
