'use client'

import { useActionState } from 'react'
import { ArrowRight, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/portal-logo'
import { signIn, type AuthActionState } from '@/app/actions/auth'

const initialState: AuthActionState = { error: null }

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  return (
    <main className="flex min-h-screen bg-[#24354c]">
      <div className="hidden flex-1 flex-col justify-between overflow-hidden p-10 lg:flex">
        <Logo compact={false} />
        <div className="relative max-w-lg pb-10">
          <div className="absolute -left-24 -top-32 size-96 rounded-full border border-[#d6b47b]/20" />
          <div className="absolute -bottom-20 -right-24 size-72 rounded-full border border-[#d6b47b]/15" />
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#d6b47b]">The Swastik Indian Art</p>
          <h1 className="font-serif text-6xl leading-[1.05] text-[#fffdf9]">Insights<br /><span className="text-[#d6b47b]">with intention.</span></h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#bdc5cd]">A considered space for creating meaningful numerology reports for every client story.</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8997a6]">© 2024 TSIA · Private workspace</p>
      </div>
      <div className="flex w-full items-center justify-center bg-[#fffdf9] px-6 py-10 sm:px-12 lg:max-w-[520px]">
        <div className="w-full max-w-[360px]">
          <div className="mb-12 lg:hidden"><Logo /></div>
          <div className="mb-9">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#f3eadc] text-[#ad7b40]"><Fingerprint className="size-6" /></div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">Welcome back</p>
            <h2 className="font-serif text-3xl font-semibold text-[#24354c]">Sign in to your portal</h2>
            <p className="mt-3 text-sm leading-6 text-[#81776b]">Use your TSIA team credentials to continue.</p>
          </div>
          <form action={formAction} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Email address<input required type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@tsia.in" className="h-12 rounded-xl border border-[#e8dfd3] bg-white px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" /></label>
            <label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Password<input required name="password" type="password" autoComplete="current-password" maxLength={256} placeholder="Enter your password" className="h-12 rounded-xl border border-[#e8dfd3] bg-white px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" /></label>
            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-not-allowed items-center gap-2 text-[#81776b] opacity-50" title="Not available yet"><input type="checkbox" disabled className="accent-[#24354c]" /> Remember me</label>
              <button type="button" disabled title="Not available yet — contact your administrator" className="font-semibold text-[#ad7b40] disabled:cursor-not-allowed disabled:opacity-50">Forgot password?</button>
            </div>
            <Button type="submit" disabled={pending} className="mt-2 h-12 rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]">{pending ? 'Signing in…' : 'Sign in'} <ArrowRight data-icon="inline-end" /></Button>
            <p role="alert" aria-live="polite" className="text-sm text-[#a55f46] empty:hidden">{state.error}</p>
          </form>
          <p className="mt-10 text-center text-[11px] leading-5 text-[#aa9c8c]">This is a private workspace for authorized TSIA team members.<br />Need access? Contact your administrator.</p>
        </div>
      </div>
    </main>
  )
}
