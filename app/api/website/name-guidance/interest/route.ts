import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import { customerIdentity, database, JS_ORGANIZATION_ID } from '@/lib/jeevansutra/customer-server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const reply = (body: unknown, status=200) => NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}})
const services = ['personal','child','business','brand','project','product','signature']
function text(value: unknown, max: number) { if(typeof value!=='string' || value.length>max) throw new Error('Check the length of your details.');return value.trim() }
function date(value: string) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
 const [y,m,d]=value.split('-').map(Number), parsed=new Date(Date.UTC(y,m-1,d))
 return y>=1900 && parsed.getUTCFullYear()===y && parsed.getUTCMonth()===m-1 && parsed.getUTCDate()===d && value<=new Date().toISOString().slice(0,10)
}
const nameTypes=['current','birth','nickname','after_marriage','professional','considering','other']
const validName=(value:string)=>/[A-Za-z]/.test(value) && /^[A-Za-z .’'—–-]+$/.test(value)
export async function POST(request:Request) {
 try {
  if(process.env.JS_CUSTOMER_GUIDANCE_ENABLED!=='true')return reply({error:'Customer access is not open yet.'},503)
  const identity=await customerIdentity(request)
  if(!identity)return reply({error:'Verify your email and complete your profile before saving.'},401)
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Invalid request.'},415)
  const reader=request.body?.getReader();if(!reader)return reply({error:'Invalid request.'},400)
  const chunks:Uint8Array[]=[];let size=0
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();return reply({error:'Request too large.'},413)}chunks.push(value)}
  let details:Record<string,unknown>, service:string, action:string
  try {
   const input=JSON.parse(Buffer.concat(chunks).toString('utf8'))
   if(!input || input.consent!==true)throw new Error('Please agree to save your request for practitioner review.')
   service=text(input.service,20);action=service==='signature'?'design':text(input.action,20)
   if(!services.includes(service)||!['review','compare','new','design'].includes(action)||(service!=='signature'&&action==='design'))throw new Error('Choose a valid service and request type.')
   const personal=service==='personal'||service==='signature', human=personal||service==='child'
   let name=text(input.name,120)
   let names:{type:string;name:string}[]|undefined
   if(service==='personal'&&action!=='new'&&input.names!==undefined){
    if(!Array.isArray(input.names)||input.names.length<1||input.names.length>7)throw new Error('Select between one and seven names.')
    const validatedNames:{type:string;name:string}[]=input.names.map((item:unknown)=>{if(!item||typeof item!=='object')throw new Error('Check each selected name.');const entry=item as Record<string,unknown>;const type=text(entry.type,30),name=text(entry.name,120);if(!nameTypes.includes(type)||!validName(name))throw new Error('Enter valid English spelling for each selected name.');return {type,name}})
    names=validatedNames
    if(new Set(validatedNames.map(item=>item.type)).size!==validatedNames.length)throw new Error('Each name type can only appear once.')
    name=validatedNames[0].name;action='review'
   }
   const alternative=text(input.alternative,120),dob=text(input.dob,10),gender=text(input.gender,30),purpose=text(input.purpose,600),context=text(input.context,600),preferences=text(input.preferences,600),usage=text(input.usage,100),signatureName=text(input.signatureName,20)
   if(!purpose)throw new Error('Tell us your purpose.')
   if(action!=='new'&&!validName(name))throw new Error('Enter the exact English spelling of the name.')
   if(action==='compare'&&!validName(alternative))throw new Error('Enter a valid second name.')
   if(human && ((action!=='new'&&!date(dob)) || (dob&&!date(dob))))throw new Error('Enter a valid date of birth.')
   if(personal&&!['Woman','Man','Another identity'].includes(gender))throw new Error('Select your gender.')
   if(!human&&!context)throw new Error('Describe what you are naming and its audience.')
   if(service==='personal'&&(names?names.some(item=>item.type==='after_marriage'):usage==='Name after marriage')&&!context)throw new Error('Describe the previous name and whether the new name is in use.')
   if(service==='signature'&&!['current','chosen'].includes(signatureName))throw new Error('Select which name the signature is for.')
   details={version:names?'JS_NAME_INTEREST_2':'JS_NAME_INTEREST_1',...(names?{names}:{}),name:action==='new'?'':name,alternative:action==='compare'?alternative:'',dob:human?dob:'',gender:personal?gender:'',purpose,context,preferences,usage:service==='personal'?usage:'',signatureName:service==='signature'?signatureName:'',signatureReviewRequired:service==='personal'}
  }catch(error){return reply({error:error instanceof Error?error.message:'Check your request.'},400)}
  const secret=process.env.JS_RATE_LIMIT_HASH_SECRET
  if(!secret||secret.length<32)return reply({error:'Saving is temporarily unavailable.'},503)
  const limit=await database('rpc/check_js_registration_rate_limit',{method:'POST',body:JSON.stringify({p_request_key:createHmac('sha256',secret).update(`name-interest:${identity.userId}`).digest('hex'),p_max_attempts:20,p_window_minutes:60})})
  if(!limit.ok)return reply({error:'Saving is temporarily unavailable.'},503)
  if(await limit.json()!==true)return reply({error:'Please wait before saving another request.'},429)
  const now=new Date().toISOString()
  const saved=await database('js_name_guidance_interests?on_conflict=auth_user_id,organization_id,service,action&select=id,updated_at',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({auth_user_id:identity.userId,client_id:identity.client.id,organization_id:JS_ORGANIZATION_ID,service,action,details,consent_at:now,updated_at:now})})
  if(!saved.ok)return reply({error:'Unable to confirm the save. Your entries are still here; please retry.'},503)
  const rows=await saved.json()
  if(!Array.isArray(rows)||rows.length!==1||!rows[0].id)return reply({error:'Unable to confirm the save. Please retry.'},503)
  return reply({saved:true,id:rows[0].id,updatedAt:rows[0].updated_at})
 }catch{return reply({error:'Unable to confirm the save. Your entries are still here; please retry.'},503)}
}
