import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-[#c5c9c4] pt-20 pb-8">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-[26px] font-semibold text-cream flex items-center gap-2 mb-4"
              aria-label="HomeParadise home"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-sage-light"
                aria-hidden="true"
              >
                <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13zm0 4c3 3 6 6 6 10a6 6 0 0 1-12 0c0-4 3-7 6-10z" />
              </svg>
              HomeParadise
            </Link>
            <p className="text-sm leading-relaxed opacity-75 max-w-[280px]">
              A small boutique for flowers, plants, and handmade home goods —
              crafted slowly, delivered thoughtfully.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {[
                {
                  label: 'Instagram',
                  path: (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                    </>
                  ),
                },
                {
                  label: 'Pinterest',
                  path: (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M11 8v9m1-5c.5-2 2-3 3-3" />
                    </>
                  ),
                },
                {
                  label: 'Facebook',
                  path: (
                    <path d="M16 4h-3a4 4 0 0 0-4 4v3H6v4h3v9h4v-9h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
                  ),
                },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 inline-flex items-center justify-center hover:bg-sage-dark hover:border-sage-dark transition-colors duration-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current fill-none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              heading: 'Shop',
              links: ['Flowers', 'Plants', 'Soaps', 'Gifts', 'New Arrivals'],
            },
            {
              heading: 'About',
              links: ['Our Story', 'Sustainability', 'Journal', 'Careers'],
            },
            {
              heading: 'Help',
              links: ['Contact', 'Shipping', 'Returns', 'Plant Care', 'FAQ'],
            },
            {
              heading: 'Connect',
              links: ['Instagram', 'Pinterest', 'Facebook', 'TikTok'],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-sans text-white text-[13px] font-semibold tracking-widest uppercase mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-sm hover:text-sage-light transition-colors duration-300"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-7 flex flex-wrap justify-between items-center gap-4 text-[13px] opacity-60">
          <span>© 2026 HomeParadise. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="#" className="hover:text-sage-light transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-sage-light transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-sage-light transition-colors">
              Cookies
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
