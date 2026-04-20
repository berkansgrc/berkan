import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users, Shield, Search, Calendar } from "lucide-react";

export const metadata = {
  title: "Kullanıcı Yönetimi | Admin",
};

export const revalidate = 60;

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: users, count } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  const studentCount = users?.filter((u) => u.role === "student" || !u.role).length || 0;
  const adminCount = users?.filter((u) => u.role === "admin").length || 0;

  return (
    <div className="p-6 lg:p-10 pb-24 lg:pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Kullanıcı Yönetimi
          </h1>
          <p className="text-muted-foreground text-base mt-1 font-medium">
            Platforma kayıtlı tüm kullanıcıları görüntüle ve yönet.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Toplam Kullanıcı", value: count || 0, color: "text-foreground", bg: "bg-muted/40" },
          { label: "Öğrenci", value: studentCount, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Yönetici", value: adminCount, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-[1.25rem] border ${s.bg} backdrop-blur-xl p-5`}>
            <p className="text-sm font-semibold text-muted-foreground mb-1">{s.label}</p>
            <div className={`text-3xl font-heading font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-heading font-black text-foreground">Tüm Kullanıcılar</h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
            {count || 0} kayıt
          </span>
        </div>

        {users && users.length > 0 ? (
          <div className="divide-y divide-border/50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/20">
              <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">#</div>
              <div className="col-span-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ad Soyad</div>
              <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rol</div>
              <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kayıt Tarihi</div>
            </div>
            {users.map((u, idx) => {
              const initials = u.full_name
                ? u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                : "?";
              const isAdmin = u.role === "admin";
              return (
                <div
                  key={u.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors"
                >
                  <div className="col-span-1 text-xs font-bold text-muted-foreground/60">
                    {idx + 1}
                  </div>
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center font-heading font-black text-[11px] text-foreground flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-sm text-foreground truncate">
                        {u.full_name || "İsimsiz Kullanıcı"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">
                        {u.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      isAdmin
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>
                      {isAdmin && <Shield className="w-3 h-3" />}
                      {u.role || "student"}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3 h-3" />
                    {new Date(u.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-heading font-bold text-foreground">Henüz kullanıcı yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
