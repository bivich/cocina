# COCINA — preparación Web Push (NO LISTO PARA PUBLICACIÓN)

Esta versión incorpora un botón en HOY para solicitar permiso de notificaciones y preparar una suscripción Web Push. **No envía avisos con la aplicación cerrada**: faltan el servidor, las claves VAPID, el guardado autenticado de suscripciones, preferencias horarias por usuario, el cron y las pruebas en dispositivos.

## Seguridad
- La clave VAPID privada nunca debe ir al navegador.
- El backend debe autenticar al usuario antes de guardar/eliminar suscripciones.
- La zona horaria debe guardarse explícitamente y la programación debe evitar duplicados diarios.
- Para iOS se necesita probar la PWA instalada en la pantalla de inicio y solicitar permiso mediante un gesto del usuario.
- No reutilizar ni publicar los ZIP intermedios como versión final.

## Pendientes prioritarios
1. Configurar despliegue real (dominio y hosting) y autenticación con URL de retorno.
2. Crear tabla segura de suscripciones y preferencias, y función de registro autenticado.
3. Crear función de envío con VAPID privada en variables de entorno y cron horario/minutal.
4. Integrar guardado del horario en HOY con la cuenta autenticada.
5. Ejecutar SQL de historial si no está aplicado, migrar perfiles locales explícitamente y probar sincronización en dos dispositivos.
6. Probar push real con la app cerrada y escenarios de permisos denegados y suscripciones caducadas.
