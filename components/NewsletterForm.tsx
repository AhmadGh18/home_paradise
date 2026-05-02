"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex gap-2 bg-white p-2 rounded-full shadow-[0_8px_32px_rgba(46,52,45,0.12)] min-w-[340px] max-w-full border border-white hover:shadow-[0_12px_48px_rgba(46,52,45,0.16)] transition-all duration-300"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem(
          "email",
        ) as HTMLInputElement;
        input.value = "";
        const btn = e.currentTarget.querySelector(
          "button",
        ) as HTMLButtonElement;
        btn.innerHTML = "✓ Subscribed";
        btn.disabled = true;
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        aria-label="Email address"
        className="flex-1 border-none outline-none px-5 py-3 text-sm bg-transparent text-ink placeholder:text-ink-soft/50 font-medium"
      />
      <button
        type="submit"
        className="bg-sage-dark text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-ink hover:shadow-lg transition-all duration-300 active:scale-95 uppercase tracking-wide"
      >
        Subscribe
      </button>
    </form>
  );
}
