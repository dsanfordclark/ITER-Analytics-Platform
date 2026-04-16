'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileBarChart,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/onboarding', label: 'Novo Cliente', icon: UserPlus },
  { href: '/relatorios', label: 'Relatórios', icon: FileBarChart },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-iter-dark text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-widest">ITER</h1>
          <p className="text-xs text-blue-300 mt-1">Painel Administrativo</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white border-r-2 border-iter-accent'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
