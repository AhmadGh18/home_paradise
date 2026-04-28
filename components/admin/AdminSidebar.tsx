'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13z" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5A2 2 0 0 1 7.5 18L6 7z" />
        <path d="M9 7a3 3 0 1 1 6 0" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-ink text-cream flex flex-col flex-shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="font-serif text-xl text-cream flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sage-light" aria-hidden="true">
            <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13zm0 4c3 3 6 6 6 10a6 6 0 0 1-12 0c0-4 3-7 6-10z" />
          </svg>
          HomeParadise
        </Link>
        <p className="text-[11px] text-white/40 mt-1 tracking-wider uppercase">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {links.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sage-dark text-white'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white/80 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Back to store
        </Link>
      </div>
    </aside>
  );
}
