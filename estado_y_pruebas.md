# COCINA BETA — fase 09

## Lo que se puede probar ya
- Directorio de recetas y portadas remotas, cuando el sitio de origen permite mostrarlas.
- Perfil seleccionado y progreso local por dispositivo.
- Importación desde URL mediante Netlify Function (requiere despliegue con funciones, no Netlify Drop).
- Exportación e importación de respaldo local.
- Preferencias locales de recordatorio.

## No está terminado ni comprobado en móviles reales
- Sincronización entre dispositivos, inicio de sesión seguro, almacenamiento cloud de fotos.
- Envío programado push con aplicación cerrada.
- Despliegue y pruebas reales de Netlify Functions.

## Para terminar sin tocar producción
1. Usar únicamente el segundo proyecto Supabase, con URL y clave **anon/public** (jamás service_role).
2. Configurar Auth y RLS, bucket privado y backend de notificaciones con secretos en entorno seguro.
3. Desplegar con Netlify CLI o Git y configurar variables de entorno.
4. Probar dos usuarios, dos teléfonos y notificación en segundo plano.

Nunca ejecutar SUPABASE_BETA_ESQUEMA.sql en el proyecto original.
