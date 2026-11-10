import {isAmendmentFamilyFields,isAmendmentFamilyReview} from './amendment-model';
import {AmendmentError} from './amendment-client';
const freeze=value=>{const copy=structuredClone(value);const walk=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(walk);Object.freeze(v);}};walk(copy);return copy;};
const stable=value=>JSON.stringify(value,(_key,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
export function createAmendmentOperation(client,memory,randomUUID=()=>crypto.randomUUID()){
 let state=Object.freeze({phase:'empty',preview:null,quote:null,receipt:null,current:null,missing:false,paused:false,error:null,pending:false}),attempt=null,reviewed=null,busy=false;const listeners=new Set();
 const publish=patch=>{state=Object.freeze({...state,...patch,pending:busy});memory?.setLocked(busy||state.phase==='unknown'||state.paused);for(const fn of listeners)fn();};
 const blocked=()=>busy||state.paused||state.phase==='unknown';
 async function run(work,recovery=false){if(busy||state.paused||!recovery&&state.phase==='unknown')throw new AmendmentError('outcome_unknown');busy=true;publish({error:null});try{return await work();}catch(e){const code=e?.code??'unavailable',stop=state.phase!=='unknown'&&code!=='invalid_fields';publish({error:code,paused:state.paused||code==='rate_limited'||stop,...(stop?{phase:'paused'}:{})});throw e;}finally{busy=false;publish({});}}
 const matches=r=>r&&attempt&&r.amendment_id===attempt.amendment.amendment_id&&r.nonce===attempt.nonce&&['accepted','needs_review','unavailable'].includes(r.outcome)&&(r.outcome==='accepted'?typeof r.request_id==='string':r.request_id===null);
 function record(r){if(!matches(r))throw new AmendmentError('outcome_unknown');reviewed=null;publish({phase:'known',receipt:freeze(r),quote:null,current:null,missing:false});return r;}
 return{getSnapshot:()=>state,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},blocked,busy:()=>busy,
  preview:()=>run(async()=>{if(attempt||state.receipt)throw new AmendmentError('outcome_unknown');const p=await client.preview();publish({phase:'ready',preview:freeze(p),quote:null,current:null});return p;}),
  quote:fields=>run(async()=>{if(state.preview?.state!=='available'||state.receipt||!isAmendmentFamilyFields(fields))throw new AmendmentError('invalid_fields');const copy=freeze(fields),q=await client.quote(copy,state.preview.amendment);reviewed=q.state==='ready'?copy:null;publish({phase:q.state==='ready'?'review':'ready',quote:freeze(q),current:null});return q;}),
  submit:(fields,challenge,confirmed)=>run(async()=>{
   if(confirmed!==true||state.phase!=='review'||state.quote?.state!=='ready'||!reviewed||!isAmendmentFamilyFields(fields,true)||stable({...fields,consent_save_card:false})!==stable(reviewed)||!isAmendmentFamilyReview(state.quote.review))throw new AmendmentError('invalid_fields');
   const nonce=randomUUID();if(typeof nonce!=='string'||/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.exec(nonce)?.[0]!==nonce)throw new AmendmentError('invalid_fields');
   attempt=freeze({amendment:state.preview.amendment,fields,review:state.quote.review,nonce});publish({phase:'unknown',missing:false});
   // Receipt-first lookup never authorizes a resend after an ambiguous writer.
   const before=await client.receipt(attempt);if(before.receipt_state==='found')return record(before.receipt);if(before.receipt_state!=='not_found')throw new AmendmentError('outcome_unknown');
   const result=await client.request(attempt,challenge);if(!matches(result))throw new AmendmentError('outcome_unknown');
   const proof=await client.receipt(attempt);if(proof.receipt_state!=='found'||!matches(proof.receipt)||stable(proof.receipt)!==stable(result)){publish({missing:proof.receipt_state==='not_found'});throw new AmendmentError('outcome_unknown');}return record(proof.receipt);
  }),
  recover:()=>run(async()=>{if(!attempt||state.phase!=='unknown')throw new AmendmentError('outcome_unknown');const p=await client.receipt(attempt);if(p.receipt_state==='not_found'){publish({missing:true});return null;}return record(p.receipt);},true),
  current:()=>run(async()=>{const id=state.receipt?.amendment_id??state.preview?.amendment?.amendment_id??state.preview?.amendment_id;if(!id)throw new AmendmentError('invalid_fields');const ref={amendmentId:id,...(state.receipt?.request_id?{requestId:state.receipt.request_id}:{})};const current=await client.current(ref);publish({phase:'current',current:freeze(current)});return current;}),
  change(){if(blocked()||state.receipt)throw new AmendmentError('outcome_unknown');reviewed=null;publish({phase:state.preview?'ready':'empty',quote:null,current:null,error:null});},
  dispose(){attempt=null;reviewed=null;busy=false;publish({phase:'empty',preview:null,quote:null,receipt:null,current:null,missing:false,paused:false,error:null});memory?.clear();}
 };
}
