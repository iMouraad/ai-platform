import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const adminSupabase = await createAdminClient();

  const email = "admin@admin.com";
  const password = "admin123";
  const username = "admin";

  try {
    // 1. Crear el usuario en Supabase Auth
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "Administrador Principal",
        username: username,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Crear el perfil en la tabla accounts.profiles
    const { error: profileError } = await adminSupabase
      .schema("accounts")
      .from("profiles")
      .insert({
        id: crypto.randomUUID(),
        auth_user_id: authUser.user.id,
        first_name: "Admin",
        last_name: "Principal",
        full_name: "Administrador Principal",
        certificate_name: "Administrador Principal",
        username: username,
        document_type: "admin",
        document_number: "0000000000",
        country_code: "EC",
        email: email,
        role: "admin", // <--- IMPORTANTE: ROL ADMIN
        is_active: true,
        is_verified: true,
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "¡Usuario Admin creado con éxito!",
      email: email,
      password: password,
      instruccion: "Ahora puedes iniciar sesión con estos datos y LUEGO BORRA este archivo por seguridad."
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
