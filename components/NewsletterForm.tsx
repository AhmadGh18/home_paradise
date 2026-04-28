'use client';

export default function NewsletterForm() {
  return (
    <form
      className="flex gap-2.5 bg-white p-2 rounded-full shadow-[0_6px_24px_rgba(46,52,45,0.08)] min-w-[340px] max-w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
        input.value = '';
        const btn = e.currentTarget.querySelector('button') as HTMLButtonElement;
        btn.textContent = '✓ Subscribed';
        btn.disabled = true;
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        aria-label="Email address"
        className="flex-1 border-none outline-none px-5 py-3 text-sm bg-transparent text-ink placeholder:text-ink-soft/60"
      />
      <button
        type="submit"
        className="bg-sage-dark text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-ink transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
