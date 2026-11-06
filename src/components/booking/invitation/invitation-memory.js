import { isCardInvitationToken } from './invitation-model';
const handoff=Symbol.for('rra.private.invitation.bootstrap.v1');
export function createInvitationMemory(scope=globalThis.window??globalThis){
 let token=null,lock=()=>{},locked=false;const listeners=new Set();
 try{const take=scope[handoff];if(typeof take==='function'){const packet=take();token=packet?.token;lock=typeof packet?.lock==='function'?packet.lock:lock;}}catch{ /* No handoff supplies no authority. */ }
 delete scope[handoff];if(!isCardInvitationToken(token))token=null;
 const store={has:()=>token!==null,read:()=>token,locked:()=>locked,setLocked(value){locked=Boolean(value);lock(locked);},subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},clear(){const had=token!==null;token=null;locked=false;lock(false);if(had)for(const listener of listeners)listener();}};
 scope.addEventListener?.('pagehide',()=>store.clear(),{once:true});return store;
}
export const invitationMemory=createInvitationMemory();
