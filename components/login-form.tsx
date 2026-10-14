'use client'

import { useActionState, useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signIn, type AuthActionState } from '@/app/actions/auth'

const initialState: AuthActionState = { error: null }

function Brand({ desktop = false }: { desktop?: boolean }) {
  return <img src="/images/jeevansutra-approved-logo.png" alt="Jeevan Sutra — The Complete Guidance Experience. Your life at the centre." width={1145} height={1374} className={desktop ? 'h-auto w-full max-w-[420px]' : 'h-auto w-[210px] max-w-full'} />
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const field = 'h-12 w-full rounded-xl border border-[#ded4cb] bg-white px-4 text-base font-normal text-[#392e30] outline-none focus:ring-2 focus:ring-[#C5A15A]'
  return <main className="min-h-screen bg-[#FAF7F0] lg:flex">
    <aside className="hidden min-h-screen flex-1 flex-col items-center justify-center bg-[#64263B] px-10 py-12 lg:flex">
      <Brand desktop />
      <p className="mt-8 max-w-sm text-center text-sm leading-7 text-[#EAD8AD]">A thoughtful space for our team to support each person’s journey with clarity and care.</p>
    </aside>
    <div className="flex w-full flex-col lg:max-w-[560px] lg:justify-center">
      <header className="flex h-[280px] shrink-0 items-center justify-center bg-[#64263B] px-6 py-3 lg:hidden"><Brand /></header>
      <div className="mx-auto w-full max-w-[440px] px-6 py-7 sm:px-8 lg:py-12">
        <h1 className="font-serif text-3xl font-semibold text-[#64263B]">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-[#81776b]">Sign in to your Jeevan Sutra team workspace.</p>
        <form action={formAction} className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#64263B]">Email address<input required type="email" name="email" autoComplete="email" maxLength={254} placeholder="Your work email address" className={field} /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#64263B]" htmlFor="employee-password">Password</label>
          <div className="relative -mt-3">
            <input id="employee-password" required name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" maxLength={256} placeholder="Enter your password" className={`${field} pr-14`} />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)} className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-[#81776b] hover:bg-[#FAF7F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64263B]">{showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}</button>
          </div>
          <Button type="submit" disabled={pending} className="h-12 rounded-xl bg-[#64263B] text-base text-white hover:bg-[#522033]">{pending ? 'Signing in…' : 'Sign in'} <ArrowRight aria-hidden="true" data-icon="inline-end" /></Button>
          <p role="alert" aria-live="polite" className="text-sm text-red-800 empty:hidden">{state.error}</p>
        </form>
        <a href="/website" target="_blank" rel="noopener noreferrer" className="group mt-6 block rounded-2xl border border-[#C5A15A]/60 bg-[#F8F1E5] p-5 text-[#64263B] transition hover:bg-[#F3E9D8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#64263B]">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#977237]">Discover Jeevan Sutra</span>
          <span className="mt-2 block font-serif text-2xl">Your journey starts here.</span>
          <span className="mt-2 block text-sm leading-6 text-[#766b67]">Explore your personal numbers and connections.</span>
          <span className="mt-4 flex items-center gap-3 text-sm font-semibold">Explore Website <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p className="mt-6 border-t border-[#ded4cb] pt-5 text-center text-xs leading-6 text-[#81776b]">Private workspace for the Jeevan Sutra team.<br />Need access? Contact your administrator.</p>
      </div>
    </div>
  </main>
}
