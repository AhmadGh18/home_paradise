import StoreLayout from '@/components/StoreLayout';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <StoreLayout>
      {/* Header */}
      <div className="bg-cream-deep py-20">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <span className="inline-block text-[12px] tracking-[3px] uppercase text-sage-dark font-medium mb-3">Get in touch</span>
          <h1 className="font-serif text-[clamp(36px,5vw,60px)] text-ink">Contact Us</h1>
          <p className="text-ink-soft mt-4 max-w-md mx-auto">
            We'd love to hear from you. Whether you have a question about an order, a product, or just want to say hello.
          </p>
        </div>
      </div>

      <section className="py-20 bg-cream">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact info */}
            <div>
              <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] text-ink mb-6">
                We're a small team with a big love for plants.
              </h2>
              <p className="text-ink-soft text-base leading-relaxed mb-10">
                Send us a message and we'll get back to you within 24 hours on business days. For urgent order queries, please include your order number.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
                    ),
                    label: 'Email',
                    value: 'hello@homeparadise.co',
                  },
                  {
                    icon: (
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.61 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6 6l.41-.41a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 18h-1z" />
                    ),
                    label: 'Phone',
                    value: '+44 20 1234 5678',
                  },
                  {
                    icon: (
                      <>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </>
                    ),
                    label: 'Studio',
                    value: '14 Greenhouse Mews, London, E3 2LB',
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4.5 h-4.5 stroke-sage-dark fill-none"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-soft mb-0.5">{label}</p>
                      <p className="text-base text-ink">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Opening hours */}
              <div className="mt-12 p-6 bg-cream-deep rounded-[18px]">
                <h3 className="font-serif text-xl text-ink mb-4">Studio hours</h3>
                <div className="space-y-2 text-sm text-ink-soft">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span><span className="text-ink font-medium">9am – 6pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span><span className="text-ink font-medium">10am – 4pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span><span className="text-ink-soft">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
