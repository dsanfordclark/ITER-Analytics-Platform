'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardCheck, AlertTriangle, FileBarChart, MessageSquare, Settings, LogOut, Building2, Scale, Landmark } from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/diagnostico', label: 'Diagnóstico', icon: ClipboardCheck },
  { href: '/kpis/admin', label: 'Administrativo', icon: Building2 },
  { href: '/kpis/legal', label: 'Jurídico', icon: Scale },
  { href: '/kpis/financial', label: 'Financeiro', icon: Landmark },
  { href: '/alertas', label: 'Alertas', icon: AlertTriangle },
  { href: '/relatorios', label: 'Relatórios', icon: FileBarChart },
  { href: '/ai-advisor', label: 'Consultor IA', icon: MessageSquare },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-iter-dark text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-lg font-extrabold tracking-[0.15em]">ITER</h1>
          <p className="text-[10px] text-blue-300 mt-0.5 tracking-wide">Analytics Platform</p>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {nav.map(n => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/')
            const I = n.icon
            return (
              <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${active ? 'bg-white/10 text-white border-r-2 border-iter-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <I size={16} />{n.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"><LogOut size={14} />Sair</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  )
}
