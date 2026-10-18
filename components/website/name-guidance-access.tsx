"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { nameGuidanceSignInPath } from '@/lib/jeevansutra/customer-destination'
import { NameGuidance } from './name-guidance'

export function NameGuidanceAccess() {
 const router=useRouter()
 const [state,setState]=useState<'checking'|'ready'|'error'>('checking')
 const [retry,setRetry]=useState(0)
 useEffect(()=>{
  let active=true
  const client=customerClient()
  if(!client){setState('error');return}
  async function check(){
   try {
    const session=await client!.auth.getSession()
    if(!active)return
    if(session.error)throw new Error('Session unavailable')
    const token=session.data.session?.access_token
    if(!token){router.replace(nameGuidanceSignInPath);return}
    const response=await fetch('/api/website/name-guidance/profile',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'})
    if(!active)return
    if(response.status===401){router.replace(nameGuidanceSignInPath);return}
    if(!response.ok)throw new Error('Profile unavailable')
    const data=await response.json()
    if(!active)return
    if(typeof data.name!=='string'||!data.name.trim()||typeof data.dob!=='string')throw new Error('Profile incomplete')
    setState('ready')
   }catch{if(active)setState('error')}
  }
  void check()
  const {data:{subscription}}=client.auth.onAuthStateChange(event=>{
   if(event==='SIGNED_OUT'&&active){active=false;setState('checking');router.replace(nameGuidanceSignInPath)}
  })
  return()=>{active=false;subscription.unsubscribe()}
 },[router,retry])
 if(state==='ready')return <NameGuidance />
 return <main className="min-h-[60vh] bg-[#FAF7F0] px-5 py-16"><div className="mx-auto max-w-xl rounded-2xl border border-[#C5A15A]/30 bg-white p-6 text-[#64263B]"><h1 className="font-serif text-3xl">Your Name Guidance</h1>{state==='checking'?<p role="status" className="mt-4 leading-7">Checking your verified registration…</p>:<><p role="alert" className="mt-4 leading-7">We could not confirm your registration. Please retry before opening name guidance.</p><button type="button" onClick={()=>{setState('checking');setRetry(value=>value+1)}} className="mt-5 min-h-12 rounded-xl bg-[#64263B] px-6 py-3 font-semibold text-white">Try again</button><Link href={nameGuidanceSignInPath} className="mt-5 block underline">Verify or complete your registration</Link></>}</div></main>
}
