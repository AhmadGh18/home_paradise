"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AdminAuthProvider";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 stroke-current fill-none"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 stroke-current fill-none"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13z" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 stroke-current fill-none"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5A2 2 0 0 1 7.5 18L6 7z" />
        <path d="M9 7a3 3 0 1 1 6 0" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-ink text-cream rounded-lg flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-current fill-none"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-ink/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-60 min-h-screen bg-ink text-cream flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl text-cream flex items-center gap-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-sage-light"
              aria-hidden="true"
            >
              <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13zm0 4c3 3 6 6 6 10a6 6 0 0 1-12 0c0-4 3-7 6-10z" />
            </svg>
            HomeParadise
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded hover:bg-white/10"
            aria-label="Close menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-current fill-none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="px-6 pt-4 text-[11px] text-white/40 tracking-wider uppercase">
          Admin
        </p>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {links.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-sage-dark text-white"
                        : "text-white/60 hover:bg-white/8 hover:text-white"
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
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white/80 transition-colors mb-4"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current fill-none"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Back to store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-white/50 hover:text-red-400 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current fill-none"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
