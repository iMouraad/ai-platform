
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkTableInfo() {
  const { data, error } = await supabase.rpc('get_table_info', { t_name: 'profiles', s_name: 'accounts' });
  // If RPC doesn't exist, I'll try to query information_schema
  const { data: info, error: infoError } = await supabase
    .from('information_schema.columns')
    .select('column_name, column_default, is_nullable')
    .eq('table_name', 'profiles')
    .eq('table_schema', 'accounts');

  console.log("Table info for accounts.profiles:");
  console.log(JSON.stringify(info, null, 2));
}

checkTableInfo();
