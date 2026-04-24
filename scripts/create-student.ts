import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createStudent() {
  const email = `student_${Math.floor(Math.random() * 10000)}@example.com`;
  const password = "StudentPassword123!";
  const username = `student_${Math.floor(Math.random() * 10000)}`;
  const firstName = "Estudiante";
  const lastName = "Prueba";
  const fullName = `${firstName} ${lastName}`;
  const documentNumber = `10${Math.floor(Math.random() * 100000000)}`;

  console.log(`Creating user with email: ${email}...`);

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (authError) {
    console.error("Error creating auth user:", authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log(`Auth user created with ID: ${userId}`);

  // 2. Create profile
  // Based on schema: accounts.profiles
  const { error: profileError } = await supabase
    .schema("accounts")
    .from("profiles")
    .insert({
      id: userId,
      auth_user_id: userId,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      certificate_name: fullName,
      username: username,
      document_type: "CC",
      document_number: documentNumber,
      country_code: "CO",
      email: email,
      role: "student",
      is_active: true,
      is_verified: true,
      current_level: 1
    });

  if (profileError) {
    console.error("Error creating profile:", profileError.message);
    // Cleanup auth user if profile creation fails
    await supabase.auth.admin.deleteUser(userId);
    return;
  }

  console.log("Profile created successfully!");
  console.log("-----------------------------------");
  console.log("Credentials:");
  console.log(`Email: ${email}`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log("-----------------------------------");
}

createStudent();
