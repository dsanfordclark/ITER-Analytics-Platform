'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement Supabase auth
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B2A4A] tracking-widest">ITER</h1>
          <p className="text-sm text-[#2E75B6] mt-1">Analytics Platform</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Entrar</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#2E75B6] text-white rounded-lg text-sm font-medium hover:bg-[#1B2A4A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Não tem conta?{' '}
            <Link href="/auth/signup" className="text-[#2E75B6] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
