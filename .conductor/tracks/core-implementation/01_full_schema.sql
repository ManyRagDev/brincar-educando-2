-- ==========================================
-- SCRIPT 01: BASE SCHEMA & INITIALIZATION
-- ==========================================

-- 1. Create Schema
CREATE SCHEMA IF NOT EXISTS brincareducando;

-- 2. Setup Types & Roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = 'brincareducando'::regnamespace) THEN
        CREATE TYPE brincareducando.app_role AS ENUM ('admin', 'user');
    END IF;
END $$;

-- 3. Utility Function: Updated At
CREATE OR REPLACE FUNCTION brincareducando.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. RBAC Table
CREATE TABLE IF NOT EXISTS brincareducando.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role brincareducando.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 5. RBAC Helper Function
CREATE OR REPLACE FUNCTION brincareducando.has_role(_user_id UUID, _role brincareducando.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = brincareducando
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM brincareducando.user_roles
        WHERE user_id = _user_id
          AND role = _role
    );
$$;

-- ==========================================
-- SCRIPT 02: CORE TABLES
-- ==========================================

-- Usuarios (Caregivers)
CREATE TABLE IF NOT EXISTS brincareducando.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criancas (Children)
CREATE TABLE IF NOT EXISTS brincareducando.criancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES brincareducando.usuarios(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    genero TEXT, -- 'menino', 'menina', 'neutro'
    avatar_id TEXT,
    interesses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historias (BrinContos)
CREATE TABLE IF NOT EXISTS brincareducando.historias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE,
    descricao TEXT,
    capa_url TEXT,
    audio_url TEXT,
    faixa_etaria_min INTEGER DEFAULT 0,
    faixa_etaria_max INTEGER DEFAULT 12,
    publicado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historico (Progress & Favorites)
CREATE TABLE IF NOT EXISTS brincareducando.historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES brincareducando.usuarios(id) ON DELETE CASCADE NOT NULL,
    crianca_id UUID REFERENCES brincareducando.criancas(id) ON DELETE CASCADE,
    historia_id UUID REFERENCES brincareducando.historias(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('leitura', 'audio', 'favorito')),
    progresso_segundos INTEGER DEFAULT 0,
    concluido BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atividades (Brincadeiras)
CREATE TABLE IF NOT EXISTS brincareducando.atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT,
    faixa_etaria_min INTEGER,
    faixa_etaria_max INTEGER,
    materiais TEXT,
    passos JSONB DEFAULT '[]'::jsonb,
    beneficios TEXT[] DEFAULT '{}',
    tempo_estimado_minutos INTEGER,
    imagem_url TEXT,
    publicado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SCRIPT 03: AUTH ISOLATION & TRIGGERS
-- ==========================================

-- Function to handle user signup with App Isolation
CREATE OR REPLACE FUNCTION brincareducando.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = brincareducando
AS $$
BEGIN
    -- ONLY create profile if app_id metadata matches 'brincareducando'
    IF (NEW.raw_user_meta_data->>'app_id' = 'brincareducando') THEN
        
        -- Insert into usuarios
        INSERT INTO brincareducando.usuarios (id, nome, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
            NEW.email
        );

        -- Default role: user
        INSERT INTO brincareducando.user_roles (user_id, role)
        VALUES (NEW.id, 'user');

    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger for Auto-Profile creation
-- Note: Requires manual intervention if other projects already have triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_brincareducando ON auth.users;
CREATE TRIGGER on_auth_user_created_brincareducando
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION brincareducando.handle_new_user();

-- ==========================================
-- SCRIPT 04: ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE brincareducando.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brincareducando.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE brincareducando.criancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE brincareducando.historias ENABLE ROW LEVEL SECURITY;
ALTER TABLE brincareducando.historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE brincareducando.atividades ENABLE ROW LEVEL SECURITY;

-- Usuarios Policies
CREATE POLICY "Users can view their own profile" ON brincareducando.usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON brincareducando.usuarios FOR UPDATE USING (auth.uid() = id);

-- Criancas Policies
CREATE POLICY "Users can manage their children" ON brincareducando.criancas FOR ALL USING (auth.uid() = usuario_id);

-- Historias Policies (Publicly viewable if published)
CREATE POLICY "Published stories are viewable by all" ON brincareducando.historias FOR SELECT USING (publicado = true);
CREATE POLICY "Admins can manage stories" ON brincareducando.historias FOR ALL USING (brincareducando.has_role(auth.uid(), 'admin'));

-- Historico Policies
CREATE POLICY "Users manage their own history" ON brincareducando.historico FOR ALL USING (auth.uid() = usuario_id);

-- Atividades Policies
CREATE POLICY "Published activities are viewable by all" ON brincareducando.atividades FOR SELECT USING (publicado = true);
CREATE POLICY "Admins can manage activities" ON brincareducando.atividades FOR ALL USING (brincareducando.has_role(auth.uid(), 'admin'));
