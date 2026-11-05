# COCINA — integración parcial para pruebas (NO publicar como versión final)

Implementado: inicio de sesión por enlace de correo usando Supabase Auth, lectura de recetas nuevas de miembros de la familia y envío de nuevas recetas a cocina_shared_recipes. Las 128 recetas locales siguen disponibles sin iniciar sesión.

NO IMPLEMENTADO: historial sincronizado, migración de historiales locales, edición/borrado remoto, reintento de recetas pendientes, notificaciones push programadas. No es la entrega final solicitada.

IMPORTANTE: configurar en Supabase Authentication > URL Configuration la URL del sitio y los redirects autorizados. La clave incluida es publicable, nunca usar una secret/service_role en el navegador.

Esta versión mantiene los datos locales como respaldo, pero las recetas guardadas sin conexión NO se sincronizan automáticamente al reconectarse. No usarla en producción sin pruebas y completar la migración.
