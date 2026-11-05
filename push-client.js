// Preparación de permisos y suscripción Web Push. No hay envío programado sin backend.
const btn=document.getElementById('betaPushEnable');
const status=document.getElementById('betaPushStatus');
function say(msg){if(status)status.textContent=msg;}
function decodeBase64Url(s){const pad='='.repeat((4-s.length%4)%4);const bin=atob((s+pad).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(bin,c=>c.charCodeAt(0));}
btn?.addEventListener('click',async()=>{
 try{
  if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){say('Este navegador no admite notificaciones push.');return;}
  if(!window.isSecureContext){say('Se necesita HTTPS.');return;}
  const permission=await Notification.requestPermission();
  if(permission!=='granted'){say('Permiso no concedido.');return;}
  const registration=await navigator.serviceWorker.ready;
  const vapid=window.COCINA_VAPID_PUBLIC_KEY;
  if(!vapid){say('Permiso concedido. Falta configurar la clave VAPID pública y el servicio de envío para activar avisos con la app cerrada.');return;}
  const sub=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:decodeBase64Url(vapid)});
  // Do not store subscriptions in localStorage or transmit them to untrusted endpoints.
  // An authenticated backend endpoint must save this subscription under auth.uid() and apply RLS.
  window.dispatchEvent(new CustomEvent('cocina:push-subscription',{detail:{subscription:sub.toJSON()}}));
  say('Suscripción creada en el navegador; pendiente de registrarla de forma segura en el servidor.');
 }catch(e){say('No se pudo activar: '+(e.message||e));}
});
