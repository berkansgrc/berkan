import { getCachedUser, getCachedProfile } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CommandPalette from "@/components/admin/CommandPalette";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cache'li auth — Navbar ile aynı istek, sıfır ekstra DB çağrısı
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const profile = await getCachedProfile(user.id);

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] bg-background">
      {/* Arka plan dekorasyonu */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Sidebar */}
      <AdminSidebar fullName={profile.full_name} email={user.email!} />

      {/* Command Palette — erişilebilir Cmd+K kısayolu */}
      <CommandPalette />

      {/* Mobil Header (Sadece mobilde görünür) */}
      <AdminMobileHeader />

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-auto lg:ml-72 w-full pt-20 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

