# COCINA — integración de historial (PRUEBAS, NO PUBLICAR)

- Se integró `cocina_cooking_events` con el perfil de la cuenta autenticada, sin fusionar automáticamente los perfiles antiguos de otros familiares.
- Cada preparación obtiene un `client_event_id` para evitar duplicados. Se cargan las preparaciones al iniciar sesión.
- Las 128 recetas originales siguen en `recetas.json` y no necesitan login para consultarse.
- Antes de probar, revisar y ejecutar `COCINA_HISTORIAL_SQL.sql` en Supabase.
- Pendiente: pruebas reales de autenticación, historial en dos dispositivos, borrados sin conexión, migración explícita de perfiles antiguos, edición de recetas compartidas y notificaciones push.
- **No publicar**: la eliminación de un evento mientras se está sin conexión todavía puede recuperarse al sincronizar; falta una cola persistente de borrados.
- El SQL requiere revisar las políticas y restricciones actuales antes de aplicarlo.
