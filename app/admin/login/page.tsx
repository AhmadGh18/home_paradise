"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

      const data = await res.json();

      if (res.ok && data.success) {
        const next = searchParams.get("next");
        const target = next && next.startsWith("/admin") ? next : "/admin";
        router.replace(target);
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-white"
              aria-hidden="true"
            >
              <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-5-3-9-8-13zm0 4c3 3 6 6 6 10a6 6 0 0 1-12 0c0-4 3-7 6-10z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-ink">Admin Login</h1>
          <p className="text-ink-soft text-sm mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-ink-soft mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark transition-colors"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-ink-soft mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-dark transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-dark text-white py-3 rounded-xl text-sm font-medium hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-ink-soft hover:text-ink transition-colors"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
