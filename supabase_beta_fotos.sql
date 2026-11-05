-- SOLO EJECUTAR EN EL SEGUNDO PROYECTO BETA. NO EN PRODUCCIÓN.
-- Requiere usuarios autenticados con Supabase Auth.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cocina-beta-fotos', 'cocina-beta-fotos', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- Cada archivo debe estar bajo la carpeta auth.uid()/
create policy "cocina beta fotos leer propias" on storage.objects
for select to authenticated using (bucket_id='cocina-beta-fotos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "cocina beta fotos subir propias" on storage.objects
for insert to authenticated with check (bucket_id='cocina-beta-fotos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "cocina beta fotos actualizar propias" on storage.objects
for update to authenticated using (bucket_id='cocina-beta-fotos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id='cocina-beta-fotos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "cocina beta fotos borrar propias" on storage.objects
for delete to authenticated using (bucket_id='cocina-beta-fotos' and (storage.foldername(name))[1] = auth.uid()::text);
