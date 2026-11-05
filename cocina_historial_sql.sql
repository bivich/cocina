-- COCINA: historial de preparaciones repetidas, independiente por usuario.
-- Ejecutar desde SQL Editor solo después de revisar el contenido.
BEGIN;
CREATE TABLE IF NOT EXISTS public.cocina_cooking_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 family_id uuid NOT NULL REFERENCES public.cocina_families(id) ON DELETE CASCADE,
 shared_recipe_id uuid NOT NULL REFERENCES public.cocina_shared_recipes(id) ON DELETE CASCADE,
 completed_at timestamptz NOT NULL DEFAULT now(),
 client_event_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT cocina_cooking_events_user_client_unique UNIQUE(user_id, client_event_id)
);
CREATE INDEX IF NOT EXISTS cocina_cooking_events_user_date_idx ON public.cocina_cooking_events(user_id, completed_at DESC);
ALTER TABLE public.cocina_cooking_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cooking events read own" ON public.cocina_cooking_events;
CREATE POLICY "cooking events read own" ON public.cocina_cooking_events FOR SELECT TO authenticated USING (user_id = auth.uid() AND cocina_is_member(family_id));
DROP POLICY IF EXISTS "cooking events insert own" ON public.cocina_cooking_events;
CREATE POLICY "cooking events insert own" ON public.cocina_cooking_events FOR INSERT TO authenticated WITH CHECK (
 user_id = auth.uid() AND cocina_is_member(family_id) AND EXISTS (
 SELECT 1 FROM public.cocina_shared_recipes s WHERE s.id = shared_recipe_id AND s.family_id = cocina_cooking_events.family_id
 ));
DROP POLICY IF EXISTS "cooking events delete own" ON public.cocina_cooking_events;
CREATE POLICY "cooking events delete own" ON public.cocina_cooking_events FOR DELETE TO authenticated USING (user_id = auth.uid() AND cocina_is_member(family_id));
COMMIT;
