import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream pt-24 pb-8 border-t-2 border-sage-dark/20">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-12 mb-20">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-[24px] font-semibold text-cream flex items-center gap-2.5 mb-5 hover:opacity-80 transition-opacity"
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
            <p className="text-[13px] leading-relaxed opacity-75 max-w-[280px] text-cream-deep mb-6">
              A thoughtfully curated botanical boutique for flowers, plants, and
              handmade home goods—crafted slowly, delivered with care.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H4V6h16v10zm-8-5.5c2.49 0 4.5-2.01 4.5-4.5S14.49 2 12 2 7.5 4.01 7.5 6.5 9.51 11 12 11z",
                },
                {
                  label: "Pinterest",
                  href: "https://pinterest.com",
                  icon: "M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2m0-2C6.48 0 2 4.48 2 10s4.48 10 10 10 10-4.48 10-10S17.52 0 12 0z",
                },
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  icon: "M16 4H14c-1.1 0-2 .9-2 2v2h-2v2.5h2V20h2.5v-9.5H17V8h-2.5V6c0-.55.45-1 1-1h1.5V4z",
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/20 inline-flex items-center justify-center hover:bg-sage-dark hover:border-sage-dark hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-cream">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              heading: "Shop",
              links: [
                { label: "Flowers", href: "/shop?category=flowers" },
                { label: "Plants", href: "/shop?category=plants" },
                { label: "Soaps", href: "/shop?category=soaps" },
                { label: "Gifts", href: "/shop?category=gifts" },
                { label: "New Arrivals", href: "/shop" },
              ],
            },
            {
              heading: "About",
              links: [
                { label: "Our Story", href: "/#about" },
                { label: "Sustainability", href: "/#about" },
                { label: "Reviews", href: "/#reviews" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              heading: "Help",
              links: [
                { label: "Contact", href: "/contact" },
                { label: "Shipping", href: "/contact" },
                { label: "Returns", href: "/contact" },
                { label: "Plant Care", href: "/contact" },
                { label: "FAQ", href: "/contact" },
              ],
            },
            {
              heading: "Connect",
              links: [
                { label: "Instagram", href: "https://instagram.com" },
                { label: "Pinterest", href: "https://pinterest.com" },
                { label: "Facebook", href: "https://facebook.com" },
                { label: "TikTok", href: "https://tiktok.com" },
              ],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-sans text-cream text-[12px] font-bold tracking-wider uppercase mb-6 opacity-90">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-cream-deep hover:text-sage-light transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-wrap justify-between items-center gap-4 text-[12px] text-cream-deep">
          <span className="opacity-70">
            © 2026 HomeParadise. All rights reserved.
          </span>
          <span className="flex gap-6">
            <Link href="#" className="hover:text-sage-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-sage-light transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-sage-light transition-colors">
              Cookie Policy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
