export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-cream">
      <span
        className="w-10 h-10 rounded-full border-[3px] border-sage-light border-t-sage-dark animate-spin"
        aria-hidden="true"
      />
      <p className="text-ink-soft text-sm">Loading…</p>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
