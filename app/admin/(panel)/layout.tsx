import AdminSidebar from "@/components/admin/AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, sessionCookie } from "@/lib/auth/session";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(sessionCookie.name)?.value;
  const session = await verifySession(token);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      {/* The top padding clears the fixed mobile bar in AdminSidebar. */}
      <main className="min-w-0 flex-1 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
