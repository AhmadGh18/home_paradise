"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "../../../public/logo1.png";

/** Only ever returns to a page inside the admin panel. */
function safeAdminPath(next: string | null): string {
  if (!next || next.includes("\\") || next.includes("//")) return "/admin";
  return /^\/admin(?:[/?#]|$)/.test(next) ? next : "/admin";
}

function waitMessage(retryAfter: string | null): string {
  const minutes = Math.ceil(Number(retryAfter) / 60);
  return minutes > 0
    ? `Too many attempts. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`
    : "Too many attempts. Please try again later.";
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh bg-cream lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 font-serif text-[20px] text-ink"
        >
          <Image
            src={logo}
            alt=""
            priority
            sizes="48px"
            className="h-12 w-12 object-contain"
          />
          HomeParadise
        </Link>

        <div className="flex flex-1 items-center py-10">
          <div className="w-full max-w-[400px]">
            <p className="eyebrow mb-4">Admin</p>
            <h1 className="font-serif text-[clamp(44px,5vw,64px)] leading-[1] tracking-[-0.02em] text-ink">
              Welcome <em className="text-sage">back.</em>
            </h1>
            <p className="mb-9 mt-4 text-[16px] text-ink-soft">
              Sign in to manage your products and orders.
            </p>

            <Suspense>
              <AdminLoginForm />
            </Suspense>
          </div>
        </div>

        <Link href="/" className="link-underline w-fit py-2 text-[14px] text-ink-soft">
          Back to store
        </Link>
      </div>

      {/* Decorative: only on screens wide enough to spare the room. */}
      <div
        className="relative hidden items-end justify-center overflow-hidden bg-sage-dark px-16 pt-20 lg:flex"
        aria-hidden="true"
      >
        <div className="absolute right-[12%] top-[10%] h-32 w-32 rounded-full bg-terracotta-soft" />
        <div className="arch relative aspect-[4/5] w-full max-w-[460px] overflow-hidden bg-sage">
          <Image
            src="https://images.unsplash.com/photo-1491147334573-44cbb4602074?auto=format&fit=crop&w=1000&q=80"
            alt=""
            fill
            sizes="460px"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}

function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.replace(safeAdminPath(searchParams.get("next")));
        router.refresh();
        return;
      }

      setPassword("");
      if (res.status === 401) {
        setError("That username or password isn't right.");
      } else if (res.status === 429) {
        setError(waitMessage(res.headers.get("retry-after")));
      } else {
        setError("We couldn't sign you in right now. Please try again shortly.");
      }
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p
          role="alert"
          className="border-l-2 border-terracotta bg-terracotta/10 px-4 py-3 text-[15px] text-ink"
        >
          {error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="field-label">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={200}
          required
          className="field"
        />
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            maxLength={1000}
            required
            className="field pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 px-4 text-[13px] text-ink-soft transition-colors duration-200 hover:text-ink"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
