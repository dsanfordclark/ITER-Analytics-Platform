# ITER Analytics Platform

**Inteligência, Estrutura e Propósito para um Novo Ciclo de Prosperidade.**

A SaaS business intelligence platform that extends ITER's consulting methodology into real-time KPI monitoring across three pillars: Administrative, Legal, and Financial.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Monorepo | Turborepo |
| AI/LLM | Anthropic Claude API + pgvector RAG |
| Auth | Supabase Auth |
| Email | Resend + React Email |
| Notifications | WhatsApp Business API |
| Hosting | Vercel |
| CI/CD | Vercel + GitHub Actions |

## Architecture

```
├── apps/
│   ├── web/          → Client dashboard (Next.js)
│   └── admin/        → ITER admin portal (Next.js)
├── packages/
│   ├── db/           → Database migrations, seeds, types
│   ├── ai/           → AI advisor (RAG + prompts)
│   ├── ui/           → Shared component library
│   ├── notifications/ → Email (Resend), WhatsApp, alerts
│   └── tsconfig/     → Shared TypeScript configs
├── supabase/
│   └── functions/    → Edge Functions
└── turbo.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start Supabase locally
npx supabase start

# Apply migrations
npx supabase db push --local

# Start dev servers
npm run dev
# web:   http://localhost:3000
# admin: http://localhost:3001
```

## License

Proprietary. All rights reserved.
