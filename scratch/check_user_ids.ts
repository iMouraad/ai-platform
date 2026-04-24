
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkUserIds() {
  const { data: progress } = await supabase
    .from('user_academy_progress')
    .select('user_id, activity_id')
    .limit(5);

  console.log("Sample progress entries:");
  console.log(JSON.stringify(progress, null, 2));

  const { data: { users } } = await supabase.auth.admin.listUsers();
  console.log("Registered users:");
  users.forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}`));
}

checkUserIds();
