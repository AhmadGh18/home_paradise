'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-ink/5 transition-shadow duration-300"
      style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none' }}
    >
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[28px] font-semibold text-sage-dark flex items-center gap-2 leading-none"
          aria-label="HomeParadise home"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-sage-dark"
            aria-hidden="true"
          >
            <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13zm0 4c3 3 6 6 6 10a6 6 0 0 1-12 0c0-4 3-7 6-10z" />
          </svg>
          HomeParadise
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex gap-8 list-none">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium relative pb-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-sage-dark after:transition-all after:duration-300 ${
                    pathname === href
                      ? 'text-sage-dark after:w-full'
                      : 'text-ink-soft hover:text-sage-dark after:w-0 hover:after:w-full'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => dispatch({ type: 'OPEN' })}
            className="relative w-10 h-10 rounded-full inline-flex items-center justify-center text-ink hover:bg-sage-light hover:text-sage-dark transition-colors duration-300"
            aria-label="Open cart"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-current fill-none stroke-[1.6]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5A2 2 0 0 1 7.5 18L6 7z" />
              <path d="M9 7a3 3 0 1 1 6 0" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-full inline-flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="flex flex-col gap-[5px]">
              <span
                className={`block w-5 h-[1.8px] bg-ink transition-transform duration-300 ${mobileOpen ? 'translate-y-[6.8px] rotate-45' : ''}`}
              />
              <span
                className={`block w-5 h-[1.8px] bg-ink transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-5 h-[1.8px] bg-ink transition-transform duration-300 ${mobileOpen ? '-translate-y-[6.8px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-ink/5 px-6 pb-5 pt-2">
          <ul className="list-none space-y-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[15px] font-medium text-ink border-b border-ink/5 last:border-0"
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
