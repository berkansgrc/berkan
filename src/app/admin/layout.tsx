import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CommandPalette from "@/components/admin/CommandPalette";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

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

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-auto lg:ml-72 w-full">
        {children}
      </main>
    </div>
  );
}

