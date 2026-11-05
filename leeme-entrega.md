# COCINA — versión prioritaria de pruebas

## Incluye
- Catálogo original de 128 recetas, accesible sin cuenta.
- Selector superior de perfiles locales; el perfil Bruno ☁️ aparece al iniciar sesión.
- Historial de Bruno sincronizable con Supabase mediante `cocina_cooking_events`, incluidas repeticiones.
- Recetas nuevas locales (no se comparten entre dispositivos, según alcance).
- Recordatorios configurables en HOY, solo locales: **no se envían con la app cerrada**.

## Pasos pendientes antes de publicar
1. En Supabase SQL Editor ejecutar `COCINA_HISTORIAL_SQL.sql` **solo si no se ha aplicado**.
2. Configurar en Supabase Auth la URL pública de redirección de la aplicación.
3. Abrir con HTTPS e iniciar sesión con el correo de Bruno; seleccionar Bruno ☁️.
4. Probar marcar una receta como completada y comprobar desde otro dispositivo que aparece tras iniciar sesión.
5. **Los historiales de perfiles locales antiguos no se migran automáticamente**: no borrar datos ni limpiar el navegador original.
6. Push con la app cerrada sigue pendiente de servidor VAPID, almacenamiento de suscripción y programador.

## Seguridad y limitaciones
- No compartir claves privadas; publishable key es pública.
- El selector de perfil no es autenticación. Solo Bruno ☁️ está vinculado a su sesión.
- No se han realizado pruebas de despliegue ni de push real.
- No sustituir el sitio actual hasta completar pruebas.
