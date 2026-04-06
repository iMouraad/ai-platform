-- ==================================================
-- BASE DE DATOS: Estructura por Esquemas
-- Módulo: ACCOUNTS (Usuarios, Perfiles y Autenticación)
-- ==================================================

-- 1. Crear Esquema si no existe
CREATE SCHEMA IF NOT EXISTS accounts;

-- 2. Tabla de Registros Pendientes (Flujo de Activación)
CREATE TABLE IF NOT EXISTS accounts.pending_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    second_last_name TEXT,
    full_name TEXT NOT NULL,
    certificate_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    country_code TEXT NOT NULL,
    email TEXT NOT NULL,
    generated_username TEXT NOT NULL,
    activation_token_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'used', 'expired'
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_document UNIQUE (document_type, document_number),
    CONSTRAINT unique_email UNIQUE (email)
);

-- 3. Tabla de Perfiles Definitivos (Extendiendo Supabase Auth)
CREATE TABLE IF NOT EXISTS accounts.profiles (
    id UUID PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    second_last_name TEXT,
    full_name TEXT NOT NULL,
    certificate_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    country_code TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'student', -- 'student', 'instructor', 'admin'
    current_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registro Histórico de Usernames (Para evitar duplicados)
CREATE TABLE IF NOT EXISTS accounts.username_registry (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Auditoría de Cuentas
CREATE TABLE IF NOT EXISTS accounts.account_audit (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID REFERENCES accounts.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'login', 'activation', 'password_reset'
    event_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Índices para Optimización
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON accounts.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON accounts.profiles(username);
CREATE INDEX IF NOT EXISTS idx_pending_token ON accounts.pending_registrations(activation_token_hash);
CREATE INDEX IF NOT EXISTS idx_pending_email ON accounts.pending_registrations(email);

-- 7. Función Auxiliar para RLS (Chequeo de Admin)
CREATE OR REPLACE FUNCTION accounts.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM accounts.profiles
    WHERE auth_user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Aplicar RLS a Perfiles
ALTER TABLE accounts.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfiles: Los usuarios pueden ver su propio perfil" 
ON accounts.profiles FOR SELECT 
USING (auth.uid() = auth_user_id OR accounts.is_admin());

CREATE POLICY "Perfiles: Los usuarios pueden actualizar su propio perfil" 
ON accounts.profiles FOR UPDATE 
USING (auth.uid() = auth_user_id OR accounts.is_admin());

CREATE POLICY "Perfiles: Solo admins pueden borrar perfiles" 
ON accounts.profiles FOR DELETE 
USING (accounts.is_admin());

-- 9. Aplicar RLS a Auditoría (Solo Admin)
ALTER TABLE accounts.account_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auditoría: Solo admins pueden ver" ON accounts.account_audit FOR SELECT USING (accounts.is_admin());

-- 10. Estructura del Módulo: DIRECTORY
CREATE SCHEMA IF NOT EXISTS directory;

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS directory.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Herramientas
CREATE TABLE IF NOT EXISTS directory.tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES directory.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para Directory
ALTER TABLE directory.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory.tools ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver categorías/herramientas activas
CREATE POLICY "Directorio: Lectura pública" 
ON directory.categories FOR SELECT 
USING (is_active = true OR accounts.is_admin());

CREATE POLICY "Directorio: Lectura pública herramientas" 
ON directory.tools FOR SELECT 
USING (is_active = true OR accounts.is_admin());

-- Solo admins pueden modificar
CREATE POLICY "Directorio: Admin Full Access Categorias" 
ON directory.categories FOR ALL 
USING (accounts.is_admin());

CREATE POLICY "Directorio: Admin Full Access Herramientas" 
ON directory.tools FOR ALL 
USING (accounts.is_admin());
