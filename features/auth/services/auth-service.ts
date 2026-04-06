import { createClient } from "@/lib/supabase/server";
import { RegisterData } from "../schemas/register-schema";
import { generateUsername } from "../utils/generate-username";
import crypto from "crypto";

export const getUsernameAvailability = async (username: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("accounts")
    .from("username_registry")
    .select("username")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") {
    // "PGRST116" means no rows found, which is expected if username is available
    throw new Error(error.message);
  }

  return !data;
};

export const getEmailAvailability = async (email: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message);

  return !data;
};

export const createPendingRegistration = async (data: RegisterData) => {
  const supabase = await createClient();
  
  // 1. Generate core name strings
  const fullName = [data.firstName, data.middleName, data.lastName, data.secondLastName]
    .filter(Boolean)
    .join(" ");
  
  const certificateName = [data.firstName, data.lastName, data.secondLastName]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  // 2. Base username generation
  let baseUsername = generateUsername(data.firstName, data.lastName, data.secondLastName);
  let finalUsername = baseUsername;
  let counter = 1;

  // 3. Increment username if taken
  while (!(await getUsernameAvailability(finalUsername))) {
    finalUsername = `${baseUsername}${counter}`;
    counter++;
  }

  // 4. Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // 5. Store in pending_registrations
  const { error } = await supabase
    .schema("accounts")
    .from("pending_registrations")
    .insert({
      first_name: data.firstName,
      middle_name: data.middleName || null,
      last_name: data.lastName,
      second_last_name: data.secondLastName || null,
      full_name: fullName,
      certificate_name: certificateName,
      document_type: data.documentType,
      document_number: data.documentNumber,
      country_code: data.countryCode,
      email: data.email,
      generated_username: finalUsername,
      activation_token_hash: tokenHash,
      status: "pending",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });

  if (error) throw new Error(error.message);

  return { token, fullName };
};
