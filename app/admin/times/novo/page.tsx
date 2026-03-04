'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { TeamForm } from '@/components/admin/TeamForm'
import type { Team } from '@/types'

export default function NovoTimePage() {
  const router = useRouter()

  const handleSubmit = async (data: Omit<Team, 'id' | 'created_at'>) => {
    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Erro ao criar time')
    router.push('/admin/times')
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/times"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <h1 className="text-2xl font-black text-[var(--text)]">Novo Time</h1>
        <p className="text-sm text-[var(--text-secondary)]">Preencha os dados do novo time</p>
      </div>

      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
        <TeamForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
