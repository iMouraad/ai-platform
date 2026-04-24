
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function compareTables() {
  const { data: pending } = await supabase.schema('accounts').from('pending_registrations').select('*').limit(5);
  const { data: profiles } = await supabase.schema('accounts').from('profiles').select('*').limit(5);

  console.log("Pending Registrations Sample:");
  console.log(JSON.stringify(pending, null, 2));

  console.log("\nProfiles Sample:");
  console.log(JSON.stringify(profiles, null, 2));
}

compareTables();
