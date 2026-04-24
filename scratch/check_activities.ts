
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActivities() {
  const { data, error } = await supabase
    .from('academy_activities')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Activities:", JSON.stringify(data, null, 2));
  }
}

checkActivities();
