import Link from "next/link";

const columns = [
  {
    heading: "Shop",
    links: [
      { label: "Everything", href: "/shop" },
      { label: "Flowers", href: "/shop?category=flowers" },
      { label: "Plants", href: "/shop?category=plants" },
      { label: "Soaps", href: "/shop?category=soaps" },
      { label: "Gifts", href: "/shop?category=gifts" },
    ],
  },
  {
    heading: "HomeParadise",
    links: [
      { label: "Our story", href: "/#about" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-sage-dark text-cream">
      <div className="page-width pb-8 pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="max-w-[14ch] font-serif text-[clamp(38px,5vw,64px)] leading-[1.05]">
              Every room deserves{" "}
              <em className="text-terracotta-soft">something living.</em>
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block text-[15px] underline decoration-cream/40 underline-offset-4 transition-colors duration-200 hover:decoration-cream"
            >
              Browse the shop
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            {columns.map(({ heading, links }) => (
              <div key={heading}>
                <h2 className="mb-5 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-sage-light">
                  {heading}
                </h2>
                <ul className="space-y-1">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="inline-block py-1.5 text-[15px] text-cream/85 transition-colors duration-200 hover:text-cream"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-cream/20 pt-6 text-[13px] text-cream/70">
          <span>© {new Date().getFullYear()} HomeParadise</span>
          <span className="font-serif italic">Bring nature home.</span>
        </div>
      </div>
    </footer>
  );
}
