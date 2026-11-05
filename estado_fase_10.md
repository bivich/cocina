# COCINA BETA — FASE 10

## Cambios verificables
- Evita importar una misma URL dos veces en el mismo navegador.
- Corrige el estado local cuando falla guardar una receta manual.
- Incrementa versión de caché para actualización de service worker.
- Añade SQL de bucket privado de fotos para el segundo proyecto BETA. **No se ejecutó SQL en ningún proyecto.**

## NO LISTO PARA PRODUCCIÓN
- La subida de fotos a Supabase aún no está conectada al cliente.
- La sincronización entre dispositivos necesita autenticación real y conexión al segundo proyecto.
- El envío de push con app cerrada necesita un emisor programado, claves VAPID y pruebas en teléfonos.
- La importación de URL necesita desplegar funciones Netlify (no solo Netlify Drop) y pruebas reales.

**No subir esta fase a la aplicación original.**
