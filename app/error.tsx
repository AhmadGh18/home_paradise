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
    <div className="min-h-[70vh] flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 stroke-terracotta fill-none"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 9v4M12 17h.01" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl text-ink mb-3">
          Something went wrong
        </h1>
        <p className="text-ink-soft mb-8">
          We hit an unexpected error. Please try again in a moment.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-sage-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-ink transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
