import { isCardInvitationFamilyFields } from './invitation-model';
import { InvitationError,invitationQuoteReference } from './invitation-client';
function freeze(value){const copy=structuredClone(value);const walk=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(walk);Object.freeze(v);}};walk(copy);return copy;}
const material=fields=>JSON.stringify({parent:fields.parent,note:fields.note});
const stable=value=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
/** Own memory only. Neither915 state nor ordinary booking storage enters here. */
export function createInvitationOperation(client,memory,randomUUID=()=>crypto.randomUUID()){
 let state={phase:'empty',preview:null,quote:null,receipt:null,current:null,missing:false,paused:false,error:null,pending:false},attempt=null,busy=false,reviewFields=null;const listeners=new Set();
 const publish=patch=>{state=Object.freeze({...state,...patch,pending:busy});memory?.setLocked(Boolean(attempt&&state.phase==='unknown'||busy));for(const listener of listeners)listener();};
 const idle=()=>{if(busy||state.paused||attempt&&state.phase==='unknown')throw new InvitationError(state.paused?'rate_limited':'outcome_unknown');};
 async function run(work,{recovery=false}={}){if(busy||state.paused||!recovery&&attempt&&state.phase==='unknown')throw new InvitationError('outcome_unknown');busy=true;publish({error:null});try{return await work();}catch(error){publish({error:error?.code??'unavailable',paused:state.paused||error?.code==='rate_limited'});throw error;}finally{busy=false;publish({});}}
 function record(receipt){attempt=null;reviewFields=null;publish({phase:'known',receipt,quote:null,missing:false,current:null});return receipt;}
 async function writer(token){let received;try{received=await client.accept(attempt,token);}catch(error){publish({phase:'unknown',missing:false});throw error;}
  // An ACK alone is insufficient: independently read the exact original proof.
  const proof=await client.receipt(attempt);if(proof.receipt_state!=='found'||stable(proof.receipt)!==stable(Object.fromEntries(Object.entries(received).filter(([key])=>key!=='replayed')))){publish({phase:'unknown',missing:proof.receipt_state==='not_found'});throw new InvitationError('outcome_unknown');}return record(proof.receipt);
 }
 return {getSnapshot:()=>state,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},blocked:()=>busy||state.paused||state.phase==='unknown',busy:()=>busy,
  preview:()=>run(async()=>{const preview=await client.preview();publish({preview,phase:'ready',quote:null,receipt:null,current:null});return preview;}),
  quote:fields=>run(async()=>{if(state.receipt&&state.receipt.outcome!=='unavailable'||!state.preview||!isCardInvitationFamilyFields(fields))throw new InvitationError('invalid_fields');const copy=freeze(fields),quote=await client.quote(copy,invitationQuoteReference(state.preview));reviewFields=material(copy);publish({quote,phase:quote.state==='quoted'?'review':'ready',receipt:null,current:null});return quote;}),
  accept:(fields,token)=>run(async()=>{if(!state.preview||state.quote?.state!=='quoted'||!isCardInvitationFamilyFields(fields,true)||material(fields)!==reviewFields)throw new InvitationError('invalid_fields');const nonce=randomUUID();attempt=freeze({fields,review:state.quote.review,nonce,reference:{invitation:state.preview.invitation_id,proposalVersion:1,nonce}});publish({phase:'unknown',missing:false});return writer(token);}),
  recover:()=>run(async()=>{if(!attempt||state.phase!=='unknown')throw new InvitationError('outcome_unknown');const proof=await client.receipt(attempt);if(proof.receipt_state==='not_found'){publish({missing:true,phase:'unknown'});return null;}return record(proof.receipt);},{recovery:true}),
  retry:token=>run(async()=>{if(!attempt||state.phase!=='unknown'||!state.missing)throw new InvitationError('outcome_unknown');const proof=await client.receipt(attempt);if(proof.receipt_state==='found')return record(proof.receipt);return writer(token);},{recovery:true}),
  current:()=>run(async()=>{const current=await client.current(state.preview?{invitation:state.preview.invitation_id,proposalVersion:1}:undefined);publish({current,phase:'current'});return current;}),
  change(){idle();if(state.receipt&&state.receipt.outcome!=='unavailable')throw new InvitationError('outcome_unknown');reviewFields=null;publish({quote:null,phase:state.preview?'ready':'empty',receipt:null,current:null});},
  clear(){if(attempt&&state.phase==='unknown')return false;attempt=null;reviewFields=null;publish({phase:'empty',preview:null,quote:null,receipt:null,current:null,missing:false});return true;},
  dispose(){attempt=null;reviewFields=null;busy=false;publish({phase:'empty',preview:null,quote:null,receipt:null,current:null,missing:false});memory?.clear();},
 };
}
