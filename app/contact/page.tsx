import type { Metadata } from "next";
import StoreLayout from "@/components/StoreLayout";

export const metadata: Metadata = {
  title: "Contact — HomeParadise",
  description:
    "Get in touch with the HomeParadise team about orders, plant care, or wholesale enquiries.",
};

const CONTACT_DETAILS = [
  { label: "Email", value: "hello@homeparadise.example", href: "mailto:hello@homeparadise.example" },
  { label: "Phone", value: "+1 (555) 012-3456", href: "tel:+15550123456" },
  { label: "Studio", value: "12 Garden Lane, London, UK", href: undefined },
  { label: "Hours", value: "Mon–Fri, 9am–6pm", href: undefined },
];

export default function ContactPage() {
  return (
    <StoreLayout>
      <section className="bg-cream-deep py-16">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-3">
            Say hello
          </span>
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] text-ink">
            Get in touch
          </h1>
          <p className="text-ink-soft mt-3 max-w-md mx-auto">
            Questions about an order, plant care, or a custom bouquet? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Details */}
        <div className="space-y-6">
          {CONTACT_DETAILS.map(({ label, value, href }) => (
            <div key={label} className="border-b border-beige pb-5">
              <div className="text-[12px] uppercase tracking-wide text-ink-soft font-bold mb-1">
                {label}
              </div>
              {href ? (
                <a
                  href={href}
                  className="text-lg text-ink hover:text-sage-dark transition-colors"
                >
                  {value}
                </a>
              ) : (
                <div className="text-lg text-ink">{value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Form (mailto-based; no backend endpoint) */}
        <form
          action="mailto:hello@homeparadise.example"
          method="post"
          encType="text/plain"
          className="bg-white p-8 rounded-2xl shadow-sm border border-white space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full border border-beige rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-light focus:border-sage-dark transition-all resize-none"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sage-dark text-white py-3.5 rounded-lg font-semibold hover:bg-ink transition-colors"
          >
            Send message
          </button>
        </form>
      </div>
    </StoreLayout>
  );
}
