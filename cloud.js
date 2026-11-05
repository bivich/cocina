import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const URL='https://grudkzkyngxfqxheiwvn.supabase.co';
const KEY='sb_publishable_sh6D0RhGGAvKFVKqb59yoA_A7c3Iki1';
const supabase=createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const el=id=>document.getElementById(id);
let familyId=null;let activeUser=null;let seedIds=new Map();let historyBusy=false;let authProfileId=null;
function status(s){const node=el('cloudStatus');if(node)node.textContent=s;}
function convert(row){return {id:row.id,seed_key:'shared-'+row.id,nombre_es:row.title,title_in_catalog:row.title,source_url:row.source_url,ingredientes_es:Array.isArray(row.ingredients)?row.ingredients:[],pasos_es:Array.isArray(row.steps)?row.steps:[],categoria_local:'general'};}
async function refresh(){
 const {data:{user},error}=await supabase.auth.getUser();if(error)console.warn(error);
 el('cloudLogout').hidden=!user;el('cloudLogin').hidden=!!user;familyId=null;
 if(!user){activeUser=null;window.cocinaAccountMode=false;authProfileId=null;status('Catálogo disponible sin iniciar sesión.');return;}
 const {data:members,error:me}=await supabase.from('cocina_members').select('family_id').eq('user_id',user.id).limit(1);
 if(me||!members?.length){status('Sesión iniciada, pero no perteneces a una familia autorizada.');return;}
 familyId=members[0].family_id;activeUser=user;window.cocinaAccountMode=false;const accountId='auth-'+user.id;authProfileId=accountId;let account=profiles.users.find(p=>p.id===accountId);if(!account){account={id:accountId,name:'Bruno ☁️',history:[]};profiles.users.push(account);}account.name='Bruno ☁️';profiles.active=accountId;saveProfiles();renderProfiles();el('profile').disabled=false;el('newProfile').disabled=false;
 const {data:rows,error:err}=await supabase.from('cocina_shared_recipes').select('id,title,source_url,ingredients,steps,is_seed').eq('family_id',familyId).eq('is_seed',false);
 if(err){status('No se pudieron leer recetas compartidas: '+err.message);return;}
 // Keep local recipes; merge remote without duplicating server IDs.
 const remoteIds=new Set((rows||[]).map(r=>r.id));
 // Remove stale cloud copies when switching accounts/families.
 mine=mine.filter(r=>!r.id || remoteIds.has(r.id));
 const existing=new Set(mine.map(r=>r.id).filter(Boolean));
 for(const row of rows||[])if(!existing.has(row.id))mine.push(convert(row));
 // New recipes stay local; sharing is not required for this release.
 await syncHistory();render();today();status('Sesión activa: '+user.email+'. Recetas compartidas cargadas. Historial: sincronización de prueba activada.');
}
el('cloudLogin').onclick=async()=>{const email=el('cloudEmail').value.trim();if(!email){status('Introduce tu correo.');return;}const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});status(error?error.message:'Revisa tu correo para abrir el enlace de acceso.');};
el('cloudLogout').onclick=async()=>{await supabase.auth.signOut();location.reload();};
window.cocinaSyncNewRecipe=async item=>{return; /* Recetas nuevas locales por decisión de producto. */
 if(!familyId){status('Receta guardada solo en este dispositivo. Inicia sesión para compartirla.');return;}
 if(item.id || item._syncing)return;
 item._syncing=true;
 const {data:{user}}=await supabase.auth.getUser();if(!user){item._syncing=false;return;}
 const {data,error}=await supabase.from('cocina_shared_recipes').insert({family_id:familyId,author_id:user.id,title:item.nombre_es,source_url:item.source_url||null,ingredients:item.ingredientes_es||[],steps:item.pasos_es||[],language:'es',is_seed:false,seed_key:null}).select('id').single();
 if(error){item._syncing=false;status('La receta sigue guardada localmente; no se pudo compartir: '+error.message);return;}
 item.id=data.id;item._syncing=false;try{localStorage.setItem('cocina_beta_local_cocina_mis_recetas_v1',JSON.stringify(mine));}catch{}status('Receta compartida con la familia.');
};
supabase.auth.onAuthStateChange(()=>setTimeout(refresh,0));refresh();

// Historial: sincronización por eventos con idempotencia, sin migrar perfiles de otros familiares.
// Requiere ejecutar COCINA_HISTORIAL_SQL.sql y disponer de los 128 seeds en Supabase.
function validUuid(s){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s||'');}
async function syncHistory(){
 if(!activeUser||!familyId||historyBusy)return;
 historyBusy=true;
 try{
  const account=profiles.users.find(p=>p.id===authProfileId);if(!account)return;
  const {data:recipes,error:re}=await supabase.from('cocina_shared_recipes').select('id,seed_key,title').eq('family_id',familyId);
  if(re)throw re;seedIds=new Map((recipes||[]).filter(x=>x.seed_key).map(x=>[x.seed_key,x.id]));
  const known=new Map((recipes||[]).map(x=>[x.id,x.title]));
  // Asignar UUID una sola vez a cada evento local del usuario autenticado.
  for(const record of account.history){if(!validUuid(record.eventId))record.eventId=crypto.randomUUID();}
  saveProfiles();
  for(const record of account.history){
   const recipeId=seedIds.get(record.recipe)||((record.recipe||'').startsWith('shared-')?record.recipe.slice(7):null);
   if(!validUuid(recipeId)||!known.has(recipeId))continue;
   const date=new Date(record.at);if(!Number.isFinite(date.getTime()))continue;
   const {error}=await supabase.from('cocina_cooking_events').upsert({user_id:activeUser.id,family_id:familyId,shared_recipe_id:recipeId,completed_at:date.toISOString(),client_event_id:record.eventId},{onConflict:'user_id,client_event_id',ignoreDuplicates:true});
   if(error)throw error;
  }
  const {data:events,error:ee}=await supabase.from('cocina_cooking_events').select('client_event_id,shared_recipe_id,completed_at').eq('user_id',activeUser.id).eq('family_id',familyId).order('completed_at',{ascending:true}).limit(5000);
  if(ee)throw ee;
  const reverse=new Map([...seedIds].map(([k,v])=>[v,k]));
  account.history=(events||[]).map(e=>({eventId:e.client_event_id,recipe:reverse.get(e.shared_recipe_id)||'shared-'+e.shared_recipe_id,title:known.get(e.shared_recipe_id)||'Receta',at:e.completed_at}));
  saveProfiles();render();today();
 }catch(e){status('Historial pendiente de sincronizar: '+(e.message||String(e))+'. Se conserva localmente.');}
 finally{historyBusy=false;}
}
// No borramos registros remotos basándonos en un estado local potencialmente incompleto.
// En particular, un evento nuevo aún no subido NO debe provocar borrados en la nube.
window.cocinaHistoryChanged=async()=>{
 if(!activeUser||!familyId||profiles.active!==authProfileId)return;
 const account=profiles.users.find(p=>p.id===authProfileId);
 if(!account)return;
 for(const record of account.history){if(!validUuid(record.eventId))record.eventId=crypto.randomUUID();}
 saveProfiles();
 await syncHistory();
};
window.addEventListener('online',()=>{if(activeUser){syncHistory();refresh();}});

window.cocinaHistoryDeleted=async record=>{if(!activeUser||!familyId||profiles.active!==authProfileId||!validUuid(record?.eventId))return;const {error}=await supabase.from('cocina_cooking_events').delete().eq('user_id',activeUser.id).eq('client_event_id',record.eventId);if(error)status('No se pudo eliminar de la nube: '+error.message);};
