import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function checkColumn() {
  const { data, error } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("premium_at")
    .limit(1);

  if (error) {
    console.log("Error selecting premium_at:", error.message);
    if (error.message.includes("column \"premium_at\" does not exist")) {
      console.log("CONFIRMED: premium_at column is missing from accounts.profiles");
    }
  } else {
    console.log("Column premium_at exists.");
  }
}

checkColumn();
