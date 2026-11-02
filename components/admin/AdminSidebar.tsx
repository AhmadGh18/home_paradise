"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LinkPendingBar from "@/components/LinkPendingBar";
import { useAuth } from "./AdminAuthProvider";
import logo from "../../public/logo1.png";

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
      {/* Mobile bar: a floating button would cover page content */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-30 h-16 px-2 flex items-center gap-1 bg-cream border-b border-beige">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-11 h-11 text-ink flex items-center justify-center"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 stroke-current fill-none"
            strokeWidth={1.5}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <Link href="/admin" className="font-serif text-[20px] text-ink">
          HomeParadise
        </Link>
      </div>

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
        fixed lg:sticky inset-y-0 lg:top-0 left-0 z-40
        w-60 h-dvh bg-sage-dark text-cream flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="px-4 py-5 border-b border-white/15 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[19px] text-cream flex items-center gap-2.5"
          >
            {/* The logo's browns need a light background to stay legible. */}
            <span className="w-10 h-10 shrink-0 rounded-full bg-cream flex items-center justify-center">
              <Image src={logo} alt="" sizes="40px" className="w-10 h-10 object-contain" />
            </span>
            HomeParadise
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden -mr-2 w-11 h-11 shrink-0 flex items-center justify-center hover:bg-white/10"
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

        <nav className="flex-1 px-3 py-4" aria-label="Admin">
          <ul className="space-y-1">
            {links.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-cream text-ink"
                        : "text-cream/75 hover:bg-white/10 hover:text-cream"
                    }`}
                  >
                    {icon}
                    {label}
                    <LinkPendingBar />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-6 py-5 border-t border-white/15">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-2.5 text-[13px] text-cream/75 hover:text-cream transition-colors"
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
            className="flex w-full items-center gap-2 py-2.5 text-[13px] text-cream/75 hover:text-cream transition-colors"
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
