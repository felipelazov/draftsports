'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Team } from '@/types'

interface TeamFormProps {
  team?: Team
  onSubmit: (data: Omit<Team, 'id' | 'created_at'>) => Promise<void>
}

const leagues = ['NBA', 'NFL', 'MLB', 'NHL', 'FUTEBOL']

const inputClass = 'w-full px-4 py-3 bg-[var(--bg)] rounded-xl border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10'
const labelClass = 'block text-xs font-medium text-[var(--text-secondary)] mb-1.5'

export function TeamForm({ team, onSubmit }: TeamFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(team?.name || '')
  const [abbreviation, setAbbreviation] = useState(team?.abbreviation || '')
  const [league, setLeague] = useState(team?.league || 'NBA')
  const [city, setCity] = useState(team?.city || '')
  const [primaryColor, setPrimaryColor] = useState(team?.primary_color || '#000000')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !league || !abbreviation) {
      setError('Nome, sigla e liga são obrigatórios.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name,
        abbreviation: abbreviation.toUpperCase(),
        league,
        city,
        primary_color: primaryColor,
      })
    } catch {
      setError('Erro ao salvar time. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Los Angeles Lakers"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sigla *</label>
          <input
            type="text"
            value={abbreviation}
            onChange={e => setAbbreviation(e.target.value)}
            placeholder="LAL"
            maxLength={5}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Liga *</label>
          <select
            value={league}
            onChange={e => setLeague(e.target.value)}
            className={inputClass + ' cursor-pointer'}
          >
            {leagues.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Cidade</label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Los Angeles"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cor Primária</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              className="w-12 h-[46px] rounded-lg border border-[var(--gray-200)] cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              placeholder="#000000"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : team ? 'Atualizar Time' : 'Criar Time'}
        </Button>
        <a
          href="/admin/times"
          className="px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
