"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthState {
  username: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  username: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsername(null);
    router.replace("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setUsername(data.user?.username ?? null);
        } else if (res.status === 401 && pathname !== "/admin/login") {
          // Session expired or missing — bounce to login (the proxy guards
          // full page loads, this covers client-side session loss too).
          setUsername(null);
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ username, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
