"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LinkPendingBar from "@/components/LinkPendingBar";
import { useCart } from "@/context/CartContext";
import logo from "../public/logo1.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, dispatch } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-beige bg-cream/95 backdrop-blur">
      <div className="page-width flex h-[72px] items-center justify-between gap-2 sm:gap-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-1.5 sm:gap-2.5"
          aria-label="HomeParadise home"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src={logo}
            alt=""
            priority
            sizes="64px"
            className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16"
          />
          <span className="font-serif text-[20px] tracking-tight text-ink sm:text-[22px]">
            HomeParadise
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`text-[15px] transition-colors duration-200 hover:text-ink ${
                    pathname === href
                      ? "text-ink underline decoration-terracotta decoration-2 underline-offset-[6px]"
                      : "text-ink-soft"
                  }`}
                >
                  {label}
                  <LinkPendingBar />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center sm:gap-4">
          <button
            onClick={() => dispatch({ type: "OPEN" })}
            className="flex h-11 min-w-11 items-center justify-center gap-2 px-1 text-[15px] text-ink transition-colors duration-200 hover:text-terracotta sm:px-2"
            aria-label={`Open cart, ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
          >
            <span className="max-[359px]:hidden">Cart</span>
            <span
              className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-medium tabular-nums ${
                totalItems > 0
                  ? "bg-sage-dark text-cream"
                  : "bg-cream-deep text-ink-soft"
              }`}
            >
              {totalItems}
            </span>
          </button>

          <button
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-none stroke-ink"
              strokeWidth={1.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile" className="border-t border-beige md:hidden">
          <ul className="page-width divide-y divide-beige">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className="block py-4 font-serif text-[24px] text-ink"
                >
                  {label}
                  <LinkPendingBar />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
