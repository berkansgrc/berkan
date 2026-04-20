// Admin kullanıcı oluşturma scripti
// Çalıştırma: node scripts/create-admin.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Hata: NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdminUser() {
  const email = "berkan_1225@hotmail.com";
  const password = "berkanberat1998";
  const fullName = "Berkan Admin";

  console.log("🔄 Admin kullanıcı oluşturuluyor...");

  // 1. Auth kullanıcısını oluştur (email doğrulaması olmadan)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Email onayı otomatik
    user_metadata: { full_name: fullName, role: "admin" },
  });

  if (authError) {
    // Kullanıcı zaten varsa güncelle
    if (authError.message.includes("already")) {
      console.log("⚠️  Kullanıcı zaten mevcut, role güncelleniyor...");
      // Kullanıcıyı listeden bul
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users?.find((u) => u.email === email);
      if (existing) {
        await supabase.auth.admin.updateUserById(existing.id, {
          user_metadata: { full_name: fullName, role: "admin" },
        });
        // Profiles tablosunu güncelle
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role: "admin", full_name: fullName })
          .eq("id", existing.id);
        if (profileError) console.error("Profile güncelleme hatası:", profileError);
        else console.log("✅ Mevcut kullanıcı admin yapıldı! ID:", existing.id);
      }
      return;
    }
    console.error("❌ Auth hatası:", authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log("✅ Auth kullanıcı oluşturuldu. ID:", userId);

  // 2. Profiles tablosunu güncelle / oluştur
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: fullName,
      role: "admin",
    });

  if (profileError) {
    console.error("❌ Profile hatası:", profileError.message);
  } else {
    console.log("✅ Profile 'admin' olarak ayarlandı.");
  }

  console.log("\n🎉 Admin kullanıcı başarıyla oluşturuldu!");
  console.log("   E-posta : " + email);
  console.log("   Şifre   : " + password);
  console.log("   Rol     : admin");
}

createAdminUser().catch(console.error);
