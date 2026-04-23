import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service role client for bypassing RLS to insert/update/delete
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Check if user is admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) return null;
  return user;
}

// POST: Create a new lesson
export async function POST(req: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("private_lessons")
      .insert({
        title: body.title,
        description: body.description,
        start_time: body.start_time,
        end_time: body.end_time,
        meet_url: body.meet_url,
        is_private: body.is_private || false,
        target_group: body.target_group || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Katılımcıları ekle
    if (body.student_ids && body.student_ids.length > 0) {
      const participants = body.student_ids.map((id: string) => ({
        lesson_id: data.id,
        user_id: id
      }));
      
      const { error: pError } = await adminClient
        .from("lesson_participants")
        .insert(participants);
        
      if (pError) throw pError;
    }

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a lesson
export async function DELETE(req: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    const adminClient = getAdminClient();
    const { error } = await adminClient.from("private_lessons").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
