
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role to check policies

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkRLS() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'user_academy_progress' });
  // Since I might not have a get_policies RPC, I'll just try to read from the system tables if possible
  // Or I'll just try to insert/select with a temp user
  
  console.log("Checking RLS policies for user_academy_progress...");
  
  const { data: policies, error: polError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'user_academy_progress');

  if (polError) {
     // If pg_policies is not accessible, I'll try another way
     console.log("pg_policies not accessible directly. Trying to infer from behavior.");
  } else {
    console.log("Policies:", JSON.stringify(policies, null, 2));
  }
}

checkRLS();
