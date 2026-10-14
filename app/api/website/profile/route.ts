import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import { customerIdentity, database } from '@/lib/jeevansutra/customer-server'
import { comparisonPerson } from '@/lib/jeevansutra/compatibility-launch'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
async function account(request: Request) {
 const match = /^Bearer ([A-Za-z0-9._-]+)$/.exec(request.headers.get('authorization') || '')
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 if (!match || match[1].length > 8192 || !url || !key) return null
 const response = await fetch(new URL('/auth/v1/user',url),{headers:{apikey:key,Authorization:`Bearer ${match[1]}`},cache:'no-store',signal:AbortSignal.timeout(10000)})
 if (!response.ok) { if(response.status===401 || response.status===403)return null; throw new Error('Verification unavailable') }
 const user = await response.json()
 return user.id && user.email && user.email_confirmed_at && !user.is_anonymous ? {id:user.id as string,email:user.email as string} : null
}
export async function GET(request: Request) {
 try {
  if(process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true')return reply({error:'Customer access is not open yet.'},503)
  const user=await account(request); if(!user)return reply({error:'Please verify your email first.'},401)
  const identity=await customerIdentity(request)
  return reply({needsProfile:!identity,email:user.email})
 } catch {return reply({error:'Unable to check your profile. Please try again.'},503)}
}
export async function POST(request: Request) {
 try {
  if(process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true' || process.env.JS_PUBLIC_REGISTRATION_ENABLED !== 'true')return reply({error:'Profile creation is not open yet.'},503)
  const user=await account(request); if(!user)return reply({error:'Please verify your email first.'},401)
  if(await customerIdentity(request))return reply({saved:true})
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Invalid request.'},415)
  const reader=request.body?.getReader(); if(!reader)return reply({error:'Invalid request.'},400)
  let size=0;const chunks:Uint8Array[]=[]
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2000){await reader.cancel();return reply({error:'Request too large.'},413)}chunks.push(value)}
  let input;try{input=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{return reply({error:'Invalid request.'},400)}
  if(!input || typeof input.name!=='string' || typeof input.dob!=='string' || input.consent!==true)return reply({error:'Enter your name, date of birth and consent.'},400)
  let person;try{person=comparisonPerson(input.name,input.dob);if(!person.dob)throw new Error('Enter your date of birth.')}catch(error){return reply({error:error instanceof Error?error.message:'Invalid profile.'},400)}
  const secret=process.env.JS_RATE_LIMIT_HASH_SECRET;if(!secret || secret.length<32)return reply({error:'Profile saving is temporarily unavailable.'},503)
  const limit=await database('rpc/check_js_registration_rate_limit',{method:'POST',body:JSON.stringify({p_request_key:createHmac('sha256',secret).update(`basic-profile:${user.id}`).digest('hex'),p_max_attempts:5,p_window_minutes:60})})
  if(!limit.ok)return reply({error:'Profile saving is temporarily unavailable.'},503)
  if(await limit.json()!==true)return reply({error:'Please wait before trying again.'},429)
  const saved=await database('rpc/save_js_basic_profile',{method:'POST',body:JSON.stringify({p_auth_user_id:user.id,p_name:person.name,p_dob:person.dob.split('/').reverse().join('-'),p_consent:true})})
  if(!saved.ok){console.error('Jeevan Sutra basic profile save failed',{status:saved.status});return reply({error:'Unable to save your profile. Retry to check or complete the save.'},503)}
  if(!await customerIdentity(request))return reply({error:'Unable to confirm your saved profile. Please retry.'},503)
  return reply({saved:true},201)
 }catch{return reply({error:'Unable to confirm the save. Please retry.'},503)}
}
