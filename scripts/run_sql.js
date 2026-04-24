import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// .env dosyasından oku
const env = fs.readFileSync(".env.local", "utf8").split('\n');
let SUPABASE_URL = "";
let SUPABASE_SERVICE_KEY = "";

env.forEach(line => {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) SUPABASE_URL = line.split("=")[1].replace(/\"|\'/g, "");
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) SUPABASE_SERVICE_KEY = line.split("=")[1].replace(/\"|\'/g, "");
});

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.log("Supabase credentials not found in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_query: `
      ALTER TABLE public.live_stream_config
      ADD COLUMN IF NOT EXISTS stream_type TEXT DEFAULT 'youtube' CHECK (stream_type IN ('youtube', 'daily')),
      ADD COLUMN IF NOT EXISTS daily_room_url TEXT;
    `
  });

  if (error) {
    console.error("RPC exec_sql failed (it might not exist):", error.message);
    
    // Test if we can insert/update directly
    const { error: updateError } = await supabase.from('live_stream_config').update({ stream_type: 'youtube' }).eq('id', '00000000-0000-0000-0000-000000000000');
    console.log("Direct update error check (expecting no column error if not added):", updateError?.message);
  } else {
    console.log("Success:", data);
  }
}

run();
