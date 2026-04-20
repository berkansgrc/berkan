"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit } from "@/lib/ratelimit";

/** Server Action'lardan IP adresi çıkar */
async function getActionIP(): Promise<string> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0].trim() ??
    hdrs.get("x-real-ip") ??
    "unknown"
  );
}

export async function login(formData: FormData) {
  // ─── Rate Limit: 1 dakikada en fazla 5 giriş denemesi ───
  const ip = await getActionIP();
  const rateCheck = await checkRateLimit(ip, "auth_login", {
    maxRequests: 5,
    windowMs: 60_000,
  });

  if (!rateCheck.allowed) {
    redirect(
      "/login?error=" +
        encodeURIComponent("Çok fazla giriş denemesi. Lütfen 1 dakika bekleyin.")
    );
  }

  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  // ─── Rate Limit: 1 dakikada en fazla 3 kayıt denemesi ───
  const ip = await getActionIP();
  const rateCheck = await checkRateLimit(ip, "auth_signup", {
    maxRequests: 3,
    windowMs: 60_000,
  });

  if (!rateCheck.allowed) {
    redirect(
      "/register?error=" +
        encodeURIComponent("Çok fazla kayıt denemesi. Lütfen 1 dakika bekleyin.")
    );
  }

  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  // Sadece student kaydına izin ver
  const allowedRoles = ["student"];
  if (!allowedRoles.includes(role)) {
    redirect("/register?error=" + encodeURIComponent("Geçersiz hesap türü."));
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });

  if (error) {
    redirect("/register?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/login?message=" + encodeURIComponent("Hesabınız oluşturuldu! Lütfen e-postanızı doğrulayın."));
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

