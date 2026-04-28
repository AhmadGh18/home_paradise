'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setState('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  if (state === 'success') {
    return (
      <div className="bg-white rounded-[24px] p-10 shadow-[0_6px_24px_rgba(46,52,45,0.08)] flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-sage-dark fill-none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-ink">Message sent!</h3>
        <p className="text-ink-soft text-sm max-w-xs">We'll get back to you within 24 hours. Thank you for reaching out.</p>
        <button onClick={() => setState('idle')} className="mt-2 text-sm text-sage-dark underline underline-offset-2 hover:text-ink transition-colors">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[24px] p-8 lg:p-10 shadow-[0_6px_24px_rgba(46,52,45,0.08)] space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-medium text-ink mb-1.5">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith"
            className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark bg-cream transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-ink mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="jane@example.com"
            className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark bg-cream transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-medium text-ink mb-1.5">Subject</label>
        <input
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder="Order query, product question…"
          className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark bg-cream transition-colors"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-ink mb-1.5">Message *</label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us how we can help…"
          className="w-full border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark bg-cream transition-colors resize-none"
        />
      </div>
      {state === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full bg-sage-dark text-white py-4 rounded-full font-medium text-base hover:bg-ink transition-colors disabled:opacity-50"
      >
        {state === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
