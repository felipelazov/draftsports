'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Team } from '@/types'

interface TeamFormProps {
  team?: Team
  onSubmit: (data: Omit<Team, 'id' | 'created_at'>) => Promise<void>
}

const leagues = ['NBA', 'NFL', 'MLB', 'NHL', 'FUTEBOL']

const colorPresets = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto', hex: '#000000' },
  { name: 'Azul', hex: '#2563EB' },
  { name: 'Vermelho', hex: '#DC2626' },
  { name: 'Amarelo', hex: '#EAB308' },
  { name: 'Verde', hex: '#16A34A' },
  { name: 'Roxo', hex: '#7C3AED' },
  { name: 'Laranja', hex: '#EA580C' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Cinza', hex: '#6B7280' },
  { name: 'Dourado', hex: '#CA8A04' },
  { name: 'Marrom', hex: '#78350F' },
  { name: 'Vinho', hex: '#881337' },
  { name: 'Azul Marinho', hex: '#1E3A5F' },
  { name: 'Aqua', hex: '#06B6D4' },
  { name: 'Grená', hex: '#A50034' },
  { name: 'Azul Claro', hex: '#7DD3FC' },
]

const inputClass = 'w-full px-4 py-3 bg-[var(--bg)] rounded-xl border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10'
const labelClass = 'block text-xs font-medium text-[var(--text-secondary)] mb-1.5'

export function TeamForm({ team, onSubmit }: TeamFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(team?.name || '')
  const [abbreviation, setAbbreviation] = useState(team?.abbreviation || '')
  const [league, setLeague] = useState(team?.league || 'NBA')
  const [city, setCity] = useState(team?.city || '')
  const [primaryColor, setPrimaryColor] = useState(team?.primary_color || '')

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
          <label className={labelClass}>Categoria *</label>
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
      </div>

      {/* Cor Primária - Presets */}
      <div>
        <label className={labelClass}>Cor Primária</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {colorPresets.map(c => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => setPrimaryColor(primaryColor === c.hex ? '' : c.hex)}
              className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                primaryColor === c.hex
                  ? 'border-[var(--primary)] scale-110 shadow-md'
                  : 'border-[var(--gray-200)] hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        {primaryColor && (
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {colorPresets.find(c => c.hex === primaryColor)?.name || primaryColor}
          </p>
        )}
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
