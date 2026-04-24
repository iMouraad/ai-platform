
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkProfile() {
  const { data, error } = await supabase
    .schema('accounts')
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching profiles:", error.message);
  } else {
    console.log("Profile example:", JSON.stringify(data, null, 2));
  }
}

checkProfile();
