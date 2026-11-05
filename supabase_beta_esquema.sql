-- SOLO PARA EL SEGUNDO PROYECTO BETA. NUNCA ejecutar en producción.
-- Requiere Supabase Auth: cada persona debe iniciar sesión con una identidad propia.
create extension if not exists pgcrypto;
create table if not exists public.cocina_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  reminder_enabled boolean not null default false,
  reminder_time time not null default '18:30',
  timezone text not null default 'America/Guayaquil',
  updated_at timestamptz not null default now()
);
create table if not exists public.cocina_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_key text not null,
  recipe_title text not null,
  cooked_at timestamptz not null default now()
);
create table if not exists public.cocina_user_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_data jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.cocina_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.cocina_profiles enable row level security;
alter table public.cocina_history enable row level security;
alter table public.cocina_user_recipes enable row level security;
alter table public.cocina_push_subscriptions enable row level security;
create policy "profiles owner" on public.cocina_profiles for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "history owner" on public.cocina_history for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "recipes owner" on public.cocina_user_recipes for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "subscriptions owner" on public.cocina_push_subscriptions for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
-- Almacenamiento privado: crear bucket cocina-beta-fotos y políticas por auth.uid().
-- No se incluyen políticas públicas de lectura ni escritura.
