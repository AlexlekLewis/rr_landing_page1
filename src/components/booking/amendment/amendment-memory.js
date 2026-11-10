const handoff=Symbol.for('rra.private.amendment.bootstrap.v1');
const valid=p=>p&&typeof p.amendmentId==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.exec(p.amendmentId)?.[0]===p.amendmentId&&typeof p.token==='string'&&/^[a-f0-9]{64}$/.exec(p.token)?.[0]===p.token;
export function createAmendmentMemory(scope=globalThis.window??globalThis){
 let capability=null,locked=false,lock=()=>{};const listeners=new Set();
 try{const take=scope[handoff];if(typeof take==='function'){const p=take();if(valid(p))capability=Object.freeze({amendmentId:p.amendmentId,token:p.token});if(typeof p?.lock==='function')lock=p.lock;}}catch{/* Missing handoff grants no access. */}
 delete scope[handoff];
 const memory={has:()=>capability!==null,read:()=>capability,locked:()=>locked,setLocked(v){locked=v===true;lock(locked);},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},clear(){const had=capability!==null;capability=null;locked=false;lock(false);if(had)for(const fn of listeners)fn();}};
 scope.addEventListener?.('pagehide',()=>memory.clear(),{once:true});return memory;
}
export const amendmentMemory=createAmendmentMemory();
