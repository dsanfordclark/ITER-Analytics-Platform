'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Consultor ITER Analytics. Posso ajudar você a entender seus KPIs, identificar riscos e recomendar ações baseadas na metodologia ITER. Como posso ajudar?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // TODO: Replace with actual API call to Supabase Edge Function
    // const res = await fetch('/api/ai-chat', { method: 'POST', body: JSON.stringify({ message: input, session_id }) })
    await new Promise(r => setTimeout(r, 1500))

    const assistantMsg: Message = {
      role: 'assistant',
      content: 'Esta é uma resposta de demonstração. Quando o backend estiver conectado, o Consultor ITER Analytics analisará seus KPIs em tempo real e fornecerá recomendações baseadas na metodologia ITER.\n\nPara ativar o consultor IA, configure a variável ANTHROPIC_API_KEY e o Supabase Edge Function.',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMsg])
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-iter-light text-iter-accent' : 'bg-gray-100 text-gray-500'}`}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[75%] rounded-xl px-4 py-3 ${msg.role === 'assistant' ? 'bg-gray-50 text-gray-800' : 'bg-iter-accent text-white'}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.role === 'assistant' ? 'text-gray-400' : 'text-blue-200'}`}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-iter-light text-iter-accent flex items-center justify-center"><Bot size={16} /></div>
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <Loader2 size={16} className="animate-spin text-iter-accent" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre seus KPIs..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-iter-accent/20 focus:border-iter-accent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-iter-accent text-white rounded-lg hover:bg-iter-dark transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Consultor IA baseado na metodologia ITER · Pilar Premium
        </p>
      </div>
    </div>
  )
}
