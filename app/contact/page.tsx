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
      <div className="page-width grid gap-14 pb-24 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
        <div className="lg:col-span-6">
          <h1 className="font-serif text-[clamp(52px,8vw,112px)] leading-[0.95] tracking-[-0.03em] text-ink">
            Say <em className="text-sage">hello.</em>
          </h1>
          <p className="mt-6 max-w-[44ch] text-[18px] leading-relaxed text-ink-soft">
            Questions about an order, plant care, or a custom bouquet? We&apos;d
            love to hear from you.
          </p>

          <dl className="mt-12 border-t border-ink/80">
            {CONTACT_DETAILS.map(({ label, value, href }) => (
              <div
                key={label}
                className="grid gap-1 border-b border-beige py-4 sm:grid-cols-[120px_1fr]"
              >
                <dt className="text-[14px] text-ink-soft">{label}</dt>
                <dd className="text-[16px] text-ink">
                  {href ? (
                    <a href={href} className="link-underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Opens the visitor's email app; there is no backend endpoint for this form. */}
        <form
          action="mailto:hello@homeparadise.example"
          method="post"
          encType="text/plain"
          className="space-y-5 bg-cream-deep/60 p-6 sm:p-10 lg:col-span-5 lg:col-start-8 lg:self-start"
        >
          <h2 className="mb-2 font-serif text-[32px] text-ink">Send a note</h2>
          <div>
            <label htmlFor="name" className="field-label">
              Name
            </label>
            <input id="name" name="name" type="text" required autoComplete="name" className="field" />
          </div>
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <div>
            <label htmlFor="message" className="field-label">
              Message
            </label>
            <textarea id="message" name="message" required rows={5} className="field resize-none" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Send message
          </button>
        </form>
      </div>
    </StoreLayout>
  );
}
