
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const gradeSlug = "6-sinif";
  
  // 1. Get course
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("grade_slug", gradeSlug)
    .single();

  if (!course) {
    console.log("No course found for 6-sinif");
    return;
  }

  console.log(`Course: ${course.name} (id: ${course.id})`);

  // 2. Get topics
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order");

  console.log("\nTopics:");
  topics?.forEach(t => console.log(`- ${t.name} (id: ${t.id}, sort_order: ${t.sort_order})`));

  // 3. Get contents
  const topicIds = topics?.map(t => t.id) || [];
  const { data: contents } = await supabase
    .from("contents")
    .select("*")
    .in("topic_id", topicIds)
    .eq("is_published", true)
    .order("sort_order");

  console.log("\nContents (ordered by sort_order):");
  contents?.forEach(c => {
    const topic = topics?.find(t => t.id === c.topic_id);
    console.log(`- ${c.title} (topic: ${topic?.name}, sort_order: ${c.sort_order})`);
  });
}

checkData();
