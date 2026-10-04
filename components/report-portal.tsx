'use client'

import {
  useState,
  useTransition,
} from 'react'

import {
  ArrowRight,
  CircleHelp,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/portal-logo'
import { ClientCard } from '@/components/client-card'
import { ConsultationWorkspace } from '@/components/consultation-workspace'

import { signOut } from '@/app/actions/auth'
import { addClient } from '@/app/actions/clients'
import { generateNumerologyV2 } from '@/app/actions/numerology'

import type {
  Client,
  ClientSourceOption,
  EmployeeOption,
  Report,
  Tone,
} from '@/lib/portal-types'

type View =
  | 'dashboard'
  | 'clients'
  | 'reports'
  | 'new-client'
  | 'generate'
  | 'consultation'

const toneClasses: Record<Tone, string> = {
  plum: 'bg-[#eee3ee] text-[#76536f]',
  terracotta: 'bg-[#f6e5dd] text-[#a55f46]',
  olive: 'bg-[#e7eddf] text-[#66805c]',
  navy: 'bg-[#e2e9f0] text-[#526b84]',
}

const inputClass =
  'h-11 w-full rounded-xl border border-[#e5dccf] bg-white px-3 text-sm font-normal text-[#3e3a35] outline-none focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20'

const labelClass =
  'flex flex-col gap-2 text-xs font-semibold text-[#5f574d]'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Sidebar({
  view,
  setView,
  open,
  setOpen,
  fullName,
}: {
  view: View
  setView: (view: View) => void
  open: boolean
  setOpen: (open: boolean) => void
  fullName: string
}) {
  const [signingOut, startSignOut] = useTransition()

  const items = [
    {
      id: 'dashboard' as View,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'clients' as View,
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'reports' as View,
      label: 'Reports',
      icon: FileText,
    },
  ]

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[#24354c]/25 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#e8dfd3] bg-[#fbf8f2] px-5 py-7 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb