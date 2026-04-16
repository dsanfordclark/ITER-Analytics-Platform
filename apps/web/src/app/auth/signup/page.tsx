'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', cnpj: '', password: '' })
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement Supabase auth + organization creation
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B2A4A] tracking-widest">ITER</h1>
          <p className="text-sm text-[#2E75B6] mt-1">Analytics Platform</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Criar Conta</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="João Silva"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="joao@empresa.com.br"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="Nome da empresa"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input
                type="text"
                value={form.cnpj}
                onChange={(e) => update('cnpj', e.target.value)}
                placeholder="00.000.000/0001-00"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/20 focus:border-[#2E75B6]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#2E75B6] text-white rounded-lg text-sm font-medium hover:bg-[#1B2A4A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Conta e Iniciar Diagnóstico'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-[#2E75B6] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
