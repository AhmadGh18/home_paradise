"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import image from "../public/logo1size.png"
import Image from "next/image";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, dispatch } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-cream/95 backdrop-blur-lg border-b border-ink/8 transition-all duration-300"
      style={{
        boxShadow: scrolled ? "0 6px 24px rgba(46,52,45,0.08)" : "none",
      }}
    >
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[26px] font-semibold text-sage-dark flex items-center gap-2.5 leading-none hover:opacity-80 transition-opacity"
          aria-label="HomeParadise home"
        >
          <Image
            src={image}
            alt="HomeParadise logo"
            priority
            className="h-14 w-auto object-contain -my-2"
          />
          <span className="hidden sm:inline">HomeParadise</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex gap-10 list-none">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium relative pb-1.5 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-sage-dark after:transition-all after:duration-300 ${pathname === href
                      ? "text-sage-dark after:w-full"
                      : "text-ink-soft hover:text-sage-dark after:w-0 hover:after:w-full"
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => dispatch({ type: "OPEN" })}
            className="relative w-10 h-10 rounded-full inline-flex items-center justify-center text-ink hover:bg-sage-light/30 hover:text-sage-dark transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Open cart"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-current fill-none stroke-[1.6]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" fill="currentColor" />
              <circle cx="20" cy="21" r="1" fill="currentColor" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none animate-pulse">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-full inline-flex items-center justify-center transition-colors hover:bg-sage-light/30"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block w-5 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? "translate-y-2.5 rotate-45 bg-sage-dark" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-ink transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? "-translate-y-2.5 -rotate-45 bg-sage-dark" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-ink/8 bg-cream/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <ul className="list-none space-y-0 max-w-[1240px] mx-auto px-6 py-3">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 px-2 text-[15px] font-medium rounded-lg transition-colors ${pathname === href
                      ? "text-sage-dark bg-sage-light/20"
                      : "text-ink hover:bg-sage-light/10 hover:text-sage-dark"
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
