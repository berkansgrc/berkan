"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Admin Client (Bypasses RLS)
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createQuizQuestion(contentId: string, formData: FormData) {
  try {
    const adminSupabase = getAdminClient();
    
    const question_text = formData.get("question_text") as string;
    const optionsRaw = formData.get("options") as string;
    const correct_option_index = parseInt(formData.get("correct_option_index") as string, 10);
    const explanation = formData.get("explanation") as string || null;

    if (!question_text || !optionsRaw || isNaN(correct_option_index)) {
      return { error: "Soru, seçenekler ve doğru cevap zorunludur." };
    }

    const options = optionsRaw.split("\n").map(opt => opt.trim()).filter(opt => opt.length > 0);
    if (options.length < 2) {
      return { error: "En az 2 seçenek gereklidir." };
    }
    
    // Get max sort_order
    const { data: existing } = await adminSupabase
      .from("content_quizzes")
      .select("sort_order")
      .eq("content_id", contentId)
      .order("sort_order", { ascending: false })
      .limit(1);
      
    const nextSortOrder = (existing && existing.length > 0) ? existing[0].sort_order + 1 : 1;

    const { error } = await adminSupabase.from("content_quizzes").insert([{
      content_id: contentId,
      question_text,
      options,
      correct_option_index,
      explanation,
      sort_order: nextSortOrder
    }]);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/icerikler/${contentId}/quiz`);
  } catch (err: any) {
    console.error("Quiz creation error:", err);
    throw err;
  }
}

export async function updateQuizQuestion(contentId: string, id: string, formData: FormData) {
  try {
    const adminSupabase = getAdminClient();
    
    const question_text = formData.get("question_text") as string;
    const optionsRaw = formData.get("options") as string;
    const correct_option_index = parseInt(formData.get("correct_option_index") as string, 10);
    const explanation = formData.get("explanation") as string || null;

    if (!question_text || !optionsRaw || isNaN(correct_option_index)) {
      return { error: "Soru, seçenekler ve doğru cevap zorunludur." };
    }

    const options = optionsRaw.split("\n").map(opt => opt.trim()).filter(opt => opt.length > 0);
    if (options.length < 2) {
      return { error: "En az 2 seçenek gereklidir." };
    }

    const { error } = await adminSupabase.from("content_quizzes").update({
      question_text,
      options,
      correct_option_index,
      explanation
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/icerikler/${contentId}/quiz`);
  } catch (err: any) {
    console.error("Quiz update error:", err);
    throw err;
  }
}

export async function deleteQuizQuestion(contentId: string, id: string) {
  try {
    const adminSupabase = getAdminClient();
    const { error } = await adminSupabase.from("content_quizzes").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath(`/admin/icerikler/${contentId}/quiz`);
  } catch (err: any) {
    console.error("Quiz deletion error:", err);
    throw err;
  }
}

export async function reorderQuizQuestions(contentId: string, payload: { id: string; sort_order: number }[]) {
  try {
    const adminSupabase = getAdminClient();
    
    await Promise.all(
      payload.map((item) =>
        adminSupabase
          .from("content_quizzes")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id)
      )
    );

    revalidatePath(`/admin/icerikler/${contentId}/quiz`);
  } catch (err: any) {
    console.error("Quiz reorder error:", err);
    throw err;
  }
}
