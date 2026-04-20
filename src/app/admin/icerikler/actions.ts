"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Admin Client (Bypasses RLS)
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Güvenlik kontrolü
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

// ================= COURSES =================
export async function createCourse(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    
    const name = formData.get("name") as string;
    const grade_slug = formData.get("grade_slug") as string;

    if (!name || !grade_slug) return { error: "Ders adı ve sınıf zorunludur." };

    const { error } = await adminSupabase.from("courses").insert([{ name, grade_slug }]);

    if (error) {
      console.error("Course insert error:", error);
      throw new Error(error.message);
    }

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Course catch error:", err);
    throw err;
  }
}

export async function updateCourse(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    const { error } = await adminSupabase.from("courses").update({ name }).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Course update error:", err);
    throw err;
  }
}

export async function deleteCourse(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const id = formData.get("id") as string;

    const { error } = await adminSupabase.from("courses").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Course delete error:", err);
    throw err;
  }
}

// ================= TOPICS =================
export async function createTopic(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const course_id = formData.get("course_id") as string;
    const name = formData.get("name") as string;

    if (!name || !course_id) return { error: "Konu adı ve ders zorunludur." };

    const { error } = await adminSupabase.from("topics").insert([{ course_id, name }]);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Topic insert error:", err);
    throw err;
  }
}

export async function updateTopic(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    const { error } = await adminSupabase.from("topics").update({ name }).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Topic update error:", err);
    throw err;
  }
}

export async function deleteTopic(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const id = formData.get("id") as string;

    const { error } = await adminSupabase.from("topics").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Topic delete error:", err);
    throw err;
  }
}

// ================= CONTENTS =================
export async function createContent(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    
    const payload = {
      topic_id: formData.get("topic_id") as string,
      title: formData.get("title") as string,
      video_url: formData.get("video_url") as string || null,
      drive_file_url: formData.get("drive_file_url") as string || null,
      app_url: formData.get("app_url") as string || null,
      is_published: formData.get("is_published") === "on",
    };

    if (!payload.title || !payload.topic_id) {
      return { error: "Başlık ve konu zorunludur." };
    }

    const { error } = await adminSupabase.from("contents").insert([payload]);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Content insert error:", err);
    throw err;
  }
}

export async function updateContent(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const id = formData.get("id") as string;
    
    const payload = {
      title: formData.get("title") as string,
      video_url: formData.get("video_url") as string || null,
      drive_file_url: formData.get("drive_file_url") as string || null,
      app_url: formData.get("app_url") as string || null,
      is_published: formData.get("is_published") === "on",
    };

    const { error } = await adminSupabase.from("contents").update(payload).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Content update error:", err);
    throw err;
  }
}

export async function deleteContent(formData: FormData) {
  try {
    // await verifyAdmin();
    const adminSupabase = getAdminClient();
    const id = formData.get("id") as string;

    const { error } = await adminSupabase.from("contents").delete().eq("id", id);
    
    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Content delete error:", err);
    throw err;
  }
}

// ================= TOPICS (NEW GRADE-CENTRIC ACTIONS) =================
export async function createTopicForGrade(formData: FormData) {
  try {
    const adminSupabase = getAdminClient();
    const grade_slug = formData.get("grade_slug") as string;
    const name = formData.get("name") as string;

    if (!name || !grade_slug) return { error: "Sınıf ve konu adı zorunludur." };

    // 1. Get or create the main course for this grade
    let { data: course } = await adminSupabase
      .from("courses")
      .select("id")
      .eq("grade_slug", grade_slug)
      .limit(1)
      .single();

    let course_id;
    if (!course) {
      const gradeLabels: Record<string, string> = {
        "5-sinif": "5. Sınıf Matematik",
        "6-sinif": "6. Sınıf Matematik",
        "7-sinif": "7. Sınıf Matematik",
        "lgs": "LGS Matematik",
        "9-sinif": "9. Sınıf Matematik",
        "10-sinif": "10. Sınıf Matematik",
        "11-sinif": "11. Sınıf Matematik",
        "tyt-ayt": "TYT-AYT Matematik",
      };
      const courseName = gradeLabels[grade_slug] || "Matematik";

      const { data: newCourse, error: courseErr } = await adminSupabase
        .from("courses")
        .insert([{ grade_slug, name: courseName }])
        .select()
        .single();

      if (courseErr) throw new Error("Ders otomatik oluşturulurken hata: " + courseErr.message);
      course_id = newCourse.id;
    } else {
      course_id = course.id;
    }

    // 2. Get max sort order to append correctly
    const { data: topics } = await adminSupabase
      .from("topics")
      .select("sort_order")
      .eq("course_id", course_id)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder = (topics && topics.length > 0 && topics[0].sort_order) ? topics[0].sort_order + 1 : 1;

    // 3. Create topic
    const { error } = await adminSupabase
      .from("topics")
      .insert([{ course_id, name, sort_order: nextSortOrder }]);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Topic insertion error:", err);
    throw err;
  }
}

export async function moveTopic(formData: FormData) {
  try {
    const adminSupabase = getAdminClient();
    const topic_id = formData.get("id") as string;
    const direction = formData.get("direction") as "up" | "down";

    if (!topic_id || !direction) return;

    const { data: currentTopic, error: fetchErr } = await adminSupabase
      .from("topics")
      .select("id, course_id")
      .eq("id", topic_id)
      .single();

    if (fetchErr) throw fetchErr;

    const { data: topics, error: allErr } = await adminSupabase
      .from("topics")
      .select("id, sort_order, created_at")
      .eq("course_id", currentTopic.course_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }); 

    if (allErr || !topics) throw allErr;

    const currentIndex = topics.findIndex(t => t.id === topic_id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;

    // Reorder array locally
    const items = [...topics];
    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;

    // Force normalized update (1..n) to resolve any `0` duplicated orders automatically
    for (let i = 0; i < items.length; i++) {
        await adminSupabase.from("topics").update({ sort_order: i + 1 }).eq("id", items[i].id);
    }

    revalidatePath("/admin/icerikler");
    revalidatePath("/sinif", "layout");
  } catch (err: any) {
    console.error("Topic move error:", err);
    throw err;
  }
}
