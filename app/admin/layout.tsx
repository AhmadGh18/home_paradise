import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-cream">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AdminAuthProvider>
  );
}
