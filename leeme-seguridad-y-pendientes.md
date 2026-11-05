# COCINA — fase de sincronización segura (NO PUBLICAR)

## Corrección implementada
- Se retiró el borrado masivo remoto que podía eliminar historiales sincronizados al comparar con un perfil local incompleto.
- Los nuevos eventos reciben UUID antes de sincronizarse.
- Si falla la recuperación del usuario durante la subida de recetas, se libera el indicador de reintento.

## Pendientes antes de publicar
1. Ejecutar/revisar `COCINA_HISTORIAL_SQL.sql` si la tabla `cocina_cooking_events` no existe.
2. Probar en dos dispositivos el inicio de sesión y los registros de historial.
3. Implementar un mecanismo explícito de eliminación de eventos (tombstones) y migración consentida de perfiles antiguos; no se borran registros en la nube por inferencia.
4. Implementar push: claves VAPID, tabla RLS de suscripciones, función segura de envío, programador y pruebas en dispositivos. El service worker por sí solo NO envía avisos.
5. Configurar Site URL y Redirect URLs de Supabase Auth con la URL real publicada.
6. Revisar edición de recetas, cambios offline y duplicación al reintentar inserciones.

No ejecutar los esquemas beta sobre tablas existentes sin revisarlos.
