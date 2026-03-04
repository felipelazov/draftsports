'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { TeamForm } from '@/components/admin/TeamForm'
import type { Team } from '@/types'

export default function EditarTimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/teams/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Time não encontrado')
        return res.json()
      })
      .then(({ team }) => setTeam(team))
      .catch(() => setError('Erro ao carregar time'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data: Omit<Team, 'id' | 'created_at'>) => {
    const res = await fetch(`/api/admin/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Erro ao atualizar time')
    router.push('/admin/times')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg animate-shimmer" />
        <div className="h-64 rounded-lg animate-shimmer" />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--text-muted)]">{error || 'Time não encontrado'}</p>
        <Link href="/admin/times" className="text-sm text-[var(--primary)] hover:underline mt-4 inline-block">
          Voltar para times
        </Link>
      </div>
    )
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
        <h1 className="text-2xl font-black text-[var(--text)]">Editar Time</h1>
        <p className="text-sm text-[var(--text-secondary)]">{team.name}</p>
      </div>

      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
        <TeamForm team={team} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
