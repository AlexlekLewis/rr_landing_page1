import {publicConfig} from '../public-client';
import {isAmendmentFamilyFields,isAmendmentFamilyReview,decodeAmendmentPreview,decodeAmendmentQuote,decodeAmendmentSubmissionReceipt,decodeAmendmentOriginalReceipt,decodeAmendmentCurrent} from './amendment-model';
export class AmendmentError extends Error{constructor(code='unavailable'){super(code);this.code=code;}}
export const amendmentError=code=>code==='rate_limited'?'Too many checks have paused this visit. Keep your original attempt unchanged.':code==='invalid_fields'?'Check your contact details and explicit confirmations.':'The result could not be verified. Keep this tab open and contact the Academy if an original attempt is uncertain.';
const uuid=s=>typeof s==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.exec(s)?.[0]===s;
async function packet(response,signal){
 if(!response.body||signal.aborted)throw new AmendmentError();
 const reader=response.body.getReader(),decoder=new TextDecoder('utf-8',{fatal:true}),parts=[];let bytes=0,complete=false,rejectAbort;
 const aborted=new Promise((_,reject)=>{rejectAbort=reject;}),cancel=()=>{void reader.cancel().catch(()=>{});},abort=()=>{rejectAbort(new AmendmentError());cancel();};signal.addEventListener('abort',abort,{once:true});
 try{if(signal.aborted)throw new AmendmentError();for(;;){const {done,value}=await Promise.race([reader.read(),aborted]);if(signal.aborted)throw new AmendmentError();if(done)break;if(!(value instanceof Uint8Array)||value.byteLength>1048576-bytes)throw new AmendmentError();bytes+=value.byteLength;parts.push(decoder.decode(value,{stream:true}));}parts.push(decoder.decode());complete=true;return JSON.parse(parts.join(''));}
 finally{signal.removeEventListener('abort',abort);if(!complete)cancel();reader.releaseLock();}
}
export function createAmendmentClient(env=import.meta.env,request=globalThis.fetch,memory){
 let halted=false;const check=v=>{if(!v)throw new AmendmentError();return v;};
 async function call(kind,body={},nonce){
  if(halted)throw new AmendmentError('rate_limited');const capability=memory?.read();if(!capability)throw new AmendmentError();
  const config=publicConfig(env),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
  try{const headers={'Content-Type':'application/json'};if(config.key)Object.assign(headers,{apikey:config.key,Authorization:`Bearer ${config.key}`});if(nonce!==undefined){if(!uuid(nonce))throw new AmendmentError('invalid_fields');headers['Idempotency-Key']=nonce;}
   const response=await request(`${config.base}/public-private-amendment-${kind}`,{method:'POST',headers,body:JSON.stringify({family_token:capability.token,amendment_id:capability.amendmentId,...body}),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});
   if(response.status===429){halted=true;void response.body?.cancel().catch(()=>{});throw new AmendmentError('rate_limited');}
   const data=await packet(response,controller.signal),key=kind==='request'?'submission':kind;
   if(!response.ok||data?.ok!==true||Object.keys(data).length!==2||!Object.hasOwn(data,key)||memory.read()!==capability)throw new AmendmentError();return data[key];
  }catch(error){controller.abort();throw error instanceof AmendmentError?error:new AmendmentError();}finally{clearTimeout(timer);}
 }
 const ref=a=>({amendmentId:a.amendment.amendment_id,nonce:a.nonce});
 return{paused:()=>halted,
  async preview(){const id=memory?.read()?.amendmentId;return check(decodeAmendmentPreview(await call('preview'),id));},
  async quote(fields,amendment){if(!isAmendmentFamilyFields(fields))throw new AmendmentError('invalid_fields');return check(decodeAmendmentQuote(await call('quote',{fields}),{amendment,fields}));},
  async request(a,challenge){if(!isAmendmentFamilyFields(a.fields,true)||!isAmendmentFamilyReview(a.review)||typeof challenge!=='string'||!challenge)throw new AmendmentError('invalid_fields');return check(decodeAmendmentSubmissionReceipt(await call('request',{fields:a.fields,review:a.review,turnstile_token:challenge,company_website:''},a.nonce),ref(a)));},
  async receipt(a){if(!isAmendmentFamilyFields(a.fields,true)||!isAmendmentFamilyReview(a.review))throw new AmendmentError('invalid_fields');return check(decodeAmendmentOriginalReceipt(await call('receipt',{fields:a.fields,review:a.review},a.nonce),ref(a)));},
  async current(ref){return check(decodeAmendmentCurrent(await call('current'),ref));}
 };
}
