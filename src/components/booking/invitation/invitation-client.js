import { publicConfig } from '../public-client';
import { isCardInvitationToken,isCardInvitationFamilyFields,isCardInvitationReview,decodeCardInvitationPreview,decodeCardInvitationQuote,decodeCardInvitationOriginalReceipt,decodeCardInvitationAccept,decodeCardInvitationCurrent } from './invitation-model';
export class InvitationError extends Error{constructor(code='unavailable'){super(code);this.code=code;}}
const id=value=>typeof value==='string'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(value);
export function invitationError(problem){return problem?.code==='rate_limited'?'Too many checks have paused this visit. Keep any original attempt unchanged.':problem?.code==='invalid_fields'?'Enter your contact details and review both permissions.':'This invitation cannot be checked right now. Contact the Academy for help. Keep any submitted original attempt unchanged.';}
export const invitationQuoteReference=preview=>({invitation:preview.invitation_id,proposalVersion:preview.proposal_version,startsAt:preview.booking.starts_at,durationMinutes:preview.booking.duration_minutes,weeks:preview.booking.weeks,participants:preview.participants.length});
async function boundedPacket(response,signal){
 if(!response.body||signal.aborted)throw new InvitationError();
 const reader=response.body.getReader(),decoder=new TextDecoder('utf-8',{fatal:true}),parts=[];let bytes=0,complete=false,rejectAbort;
 const aborted=new Promise((_,reject)=>{rejectAbort=reject;}),cancel=()=>{void reader.cancel().catch(()=>{});},abort=()=>{rejectAbort(new InvitationError());cancel();};
 signal.addEventListener('abort',abort,{once:true});
 try{
  if(signal.aborted)throw new InvitationError();
  while(true){const {done,value}=await Promise.race([reader.read(),aborted]);if(signal.aborted)throw new InvitationError();if(done)break;if(!(value instanceof Uint8Array)||value.byteLength>1048576-bytes)throw new InvitationError();bytes+=value.byteLength;const text=decoder.decode(value,{stream:true});if(text)parts.push(text);}
  parts.push(decoder.decode());complete=true;return JSON.parse(parts.join(''));
 }finally{signal.removeEventListener('abort',abort);if(!complete)cancel();reader.releaseLock();}
}
export function createInvitationClient(env=import.meta.env,request=globalThis.fetch,memory){
 async function call(kind,body={},nonce){const token=memory?.read();if(!isCardInvitationToken(token))throw new InvitationError();const config=publicConfig(env),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
  try{const headers={'Content-Type':'application/json'};if(config.key)Object.assign(headers,{apikey:config.key,Authorization:`Bearer ${config.key}`});if(nonce){if(!id(nonce))throw new InvitationError();headers['Idempotency-Key']=nonce;}
   const response=await request(`${config.base}/public-private-card-invitation-${kind}`,{method:'POST',headers,body:JSON.stringify({invitation_token:token,...body}),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});
   if(response.status===429){void response.body?.cancel().catch(()=>{});throw new InvitationError('rate_limited');}const packet=await boundedPacket(response,controller.signal);
   const key={preview:'preview',quote:'quote',accept:'acceptance',receipt:'receipt',current:'current'}[kind];if(!response.ok||packet?.ok!==true||Object.keys(packet).length!==2||!Object.hasOwn(packet,key))throw new InvitationError();if(memory.read()!==token)throw new InvitationError();return packet[key];
  }catch(error){controller.abort();throw error instanceof InvitationError?error:new InvitationError();}finally{clearTimeout(timer);}
 }
 const check=(value)=>{if(!value)throw new InvitationError();return value;};
 return {
  async preview(){return check(decodeCardInvitationPreview(await call('preview')));},
  async quote(fields,reference){if(!isCardInvitationFamilyFields(fields))throw new InvitationError('invalid_fields');return check(decodeCardInvitationQuote(await call('quote',{fields}),reference));},
  async accept(attempt,turnstile){if(!isCardInvitationFamilyFields(attempt.fields,true)||!isCardInvitationReview(attempt.review)||!turnstile)throw new InvitationError('invalid_fields');return check(decodeCardInvitationAccept(await call('accept',{fields:attempt.fields,review:attempt.review,turnstile_token:turnstile,company_website:''},attempt.nonce),attempt.reference));},
  async receipt(attempt){return check(decodeCardInvitationOriginalReceipt(await call('receipt',{fields:attempt.fields,review:attempt.review},attempt.nonce),attempt.reference));},
  async current(reference){const raw=await call('current');return check(decodeCardInvitationCurrent(raw,reference??{invitation:raw?.invitation_id,proposalVersion:1}));},
 };
}
