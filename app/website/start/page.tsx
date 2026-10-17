'use client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { customerDestination } from '@/lib/jeevansutra/customer-destination'
import { DobInput } from '@/components/dob-input'
const field='mt-2 w-full rounded-xl border border-[#ded4cb] bg-white p-3'
const button='mt-5 w-full rounded-xl bg-[#762b40] px-5 py-4 font-semibold text-white disabled:opacity-50'
export default function StartPage(){
 const router=useRouter()
 const [forCompatibility,setForCompatibility]=useState(false)
 function destination(){return customerDestination(window.location.search)}
 const emailInput=useRef<HTMLInputElement>(null)
 const [email,setEmail]=useState(''),[sent,setSent]=useState(''),[code,setCode]=useState('')
 const [name,setName]=useState(''),[dob,setDob]=useState(''),[consent,setConsent]=useState(false)
 const [needsProfile,setNeedsProfile]=useState(false),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(''),[cooldown,setCooldown]=useState(0),[verified,setVerified]=useState(false)
 async function checkProfile(){
  const session=await customerClient()?.auth.getSession();const token=session?.data.session?.access_token
  if(!token)return
  const response=await fetch('/api/website/profile',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'})
  const data=await response.json()
  if(!response.ok)throw new Error(data.error || 'Unable to check your profile.')
  setVerified(true);setEmail(data.email);setNeedsProfile(data.needsProfile)
  if(!data.needsProfile)router.replace(destination())
 }
 useEffect(()=>{setForCompatibility(destination()==='/website/compatibility');void checkProfile().catch(()=>setError('Unable to connect. Please reload.')).finally(()=>setLoading(false))},[])
 useEffect(()=>{if(!cooldown)return;const timer=setTimeout(()=>setCooldown(v=>v-1),1000);return()=>clearTimeout(timer)},[cooldown])
 async function changeEmail(){
  if(busy)return
  setBusy(true);setError('')
  try{
   const client=customerClient()
   if(!client){setError('Email access is unavailable. Please reload.');return}
   // End this browser's customer session only; no account email or client record is changed.
   const result=await client.auth.signOut({scope:'local'})
   if(result.error){setError('Unable to switch email. Please try again.');return}
   const session=await client.auth.getSession()
   if(session.error || session.data.session){setError('Unable to switch email. Please reload and try again.');return}
   setVerified(false);setNeedsProfile(false);setEmail('');setSent('');setCode('');setConsent(false)
   // Retain unsaved name/DOB while the customer verifies the replacement address.
   requestAnimationFrame(()=>emailInput.current?.focus())
  }catch{setError('Unable to switch email. Please try again.')}finally{setBusy(false)}
 }
 async function verify(event:FormEvent){
  event.preventDefault();setBusy(true);setError('')
  try{
   const client=customerClient();if(!client){setError('Email access is unavailable.');return}
   if(!sent){
    const address=email.trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)){setError('Enter a valid email address.');return}
    const result=await client.auth.signInWithOtp({email:address,options:{shouldCreateUser:true}})
    if(result.error){setError('Unable to send a code. Please try again later.');return}
    setSent(address);setCooldown(60)
   }else{
    const result=await client.auth.verifyOtp({email:sent,token:code.trim(),type:'email'})
    if(result.error){setError('The code is invalid or expired.');return}
    await checkProfile()
   }
  }catch{setError('Unable to connect. Please try again.')}finally{setBusy(false)}
 }
 async function save(event:FormEvent){
  event.preventDefault();setError('');if(!dob){setError('Enter a valid date of birth.');return}setBusy(true)
  try{
   const session=await customerClient()?.auth.getSession();const token=session?.data.session?.access_token
   if(!token){setVerified(false);setNeedsProfile(false);setSent('');setError('Please verify your email again.');return}
   const response=await fetch('/api/website/profile',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({name,dob:dob.split('-').reverse().join('/'),consent})})
   const data=await response.json();if(!response.ok){setError(data.error || 'Unable to save profile.');return}
   router.replace(destination())
  }catch{setError('Unable to confirm the save. Your details are still here; please retry.')}finally{setBusy(false)}
 }
 return <main className="min-h-screen bg-[#f9f5ef] px-5 py-8 text-[#392e30]"><div className="mx-auto max-w-xl"><section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-6"><h1 className="font-serif text-3xl">{needsProfile?'Create your basic profile':forCompatibility?'Verify your email to check compatibility':'Start with your email'}</h1><p className="mt-3">{needsProfile?'Your email is verified. Add your name and date of birth once to save your basic profile.':forCompatibility?'Verify your email to continue to compatibility. Already registered? We’ll use your saved profile.':'New or returning? Verify your email to continue. If you already have a profile, we’ll open it for you.'}</p>{error && <p role="alert" className="mt-4 text-red-800">{error}</p>}
 {loading?<p role="status" className="mt-5">Checking your account…</p>:needsProfile?<form onSubmit={save} className="mt-5"><div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#C5A15A]/30 bg-[#FAF7F0] p-3"><p className="min-w-0 break-all text-sm">Verified email: <strong className="text-[#64263B]">{email}</strong></p><button type="button" onClick={()=>void changeEmail()} disabled={busy} className="min-h-11 shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-[#64263B] underline underline-offset-4 hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">Change Email</button></div><label className="mt-4 block">Your full name in English<input required maxLength={120} autoComplete="name" className={field} value={name} onChange={e=>setName(e.target.value)} /></label><label className="mt-4 block">Date of birth — DD/MM/YYYY<DobInput value={dob} onChange={setDob} required /></label><label className="mt-5 flex items-start gap-3"><input required type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1" />I agree to Jeevan Sutra saving my name and date of birth to create my numerology profile.</label><button className={button} disabled={busy}>{busy?'Saving…':forCompatibility?'Save & Continue to Compatibility':'Save My Profile & Continue'}</button><p className="mt-4 text-sm">Mobile number and other booking details can be added when needed for a service.</p></form>:verified?<><p role="status" className="mt-5">{forCompatibility?'Opening compatibility…':'Opening your saved profile…'}</p><Link href={forCompatibility?'/website/compatibility':'/website/welcome'} className="mt-4 inline-block underline">{forCompatibility?'Continue to Compatibility':'Open My Profile'}</Link></>:<form onSubmit={verify} className="mt-5"><label className="block">Email address<input ref={emailInput} type="email" required autoComplete="email" disabled={Boolean(sent)} className={field} value={email} onChange={e=>setEmail(e.target.value)} /></label>{sent && <><p className="mt-3 text-sm">Check your inbox and Spam or Junk. Keep this page open.</p><label className="mt-4 block">Email verification code<input required inputMode="numeric" autoComplete="one-time-code" maxLength={10} pattern="[0-9]{6,10}" className={field} value={code} onChange={e=>setCode(e.target.value)} /></label></>}<button className={button} disabled={busy}>{busy?'Please wait…':sent?'Verify & Continue':'Send Verification Code'}</button>{sent && <button type="button" className="mt-4 underline" disabled={busy || cooldown>0} onClick={()=>{setSent('');setCode('')}}>{cooldown?`Request another code in ${cooldown}s`:'Use another email or resend'}</button>}</form>}
 </section></div></main>
}
