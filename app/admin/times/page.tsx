'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Plus, Search, Trash2, Shield, Check, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import type { Team } from '@/types'

const leagues = ['NBA', 'NFL', 'MLB', 'NHL', 'FUTEBOL']

export default function AdminTimesPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [leagueFilter, setLeagueFilter] = useState<string>('')
  const [cityFilter, setCityFilter] = useState<string>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const editRef = useRef<HTMLInputElement>(null)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const fetchTeams = () => {
    setLoading(true)
    fetch('/api/admin/teams')
      .then(res => res.json())
      .then(({ teams }) => setTeams(teams || []))
      .catch(() => setTeams([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTeams() }, [])

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editingId])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/teams/${id}`, { method: 'DELETE' })
      setTeams(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
    setDeleteId(null)
  }

  const startEdit = (team: Team) => {
    setEditingId(team.id)
    setEditName(team.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return cancelEdit()
    try {
      const res = await fetch(`/api/admin/teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (res.ok) {
        setTeams(prev => prev.map(t => t.id === id ? { ...t, name: editName.trim() } : t))
      }
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
    setEditingId(null)
    setEditName('')
  }

  const cities = [...new Set(teams.map(t => t.city).filter(Boolean))].sort()

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col) return <ArrowUpDown size={14} className="text-[var(--gray-300)]" />
    return sortDir === 'asc'
      ? <ArrowUp size={14} className="text-[var(--primary)]" />
      : <ArrowDown size={14} className="text-[var(--primary)]" />
  }

  const filtered = teams
    .filter(t => {
      const matchSearch = search === '' ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.abbreviation.toLowerCase().includes(search.toLowerCase())
      const matchLeague = leagueFilter === '' || t.league === leagueFilter
      const matchCity = cityFilter === '' || t.city === cityFilter
      return matchSearch && matchLeague && matchCity
    })
    .sort((a, b) => {
      if (!sortKey) return 0
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'name': return a.name.localeCompare(b.name) * dir
        case 'abbreviation': return a.abbreviation.localeCompare(b.abbreviation) * dir
        case 'league': return a.league.localeCompare(b.league) * dir
        case 'city': return a.city.localeCompare(b.city) * dir
        default: return 0
      }
    })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)]">Times</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {filtered.length} de {teams.length} times
          </p>
        </div>
        <Link
          href="/admin/times/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white rounded-[var(--radius-md)] text-sm font-semibold hover:shadow-[var(--shadow-glow)] transition-shadow"
        >
          <Plus size={18} />
          Novo Time
        </Link>
      </div>

      {/* Filters - all side by side */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar nome ou sigla..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>
        <select
          value={leagueFilter}
          onChange={e => setLeagueFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Todas as categorias</option>
          {leagues.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Todas as cidades</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {(search || leagueFilter || cityFilter) && (
          <button
            onClick={() => { setSearch(''); setLeagueFilter(''); setCityFilter('') }}
            className="px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] transition-colors cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 rounded-lg animate-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            Nenhum time encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--gray-100)]">
                  <th className="text-left px-6 py-3">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Nome <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button onClick={() => toggleSort('abbreviation')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Sigla <SortIcon col="abbreviation" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button onClick={() => toggleSort('league')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Categoria <SortIcon col="league" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button onClick={() => toggleSort('city')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Cidade <SortIcon col="city" />
                    </button>
                  </th>
                  <th className="text-center px-6 py-3 font-semibold text-[var(--text-secondary)]">Cor</th>
                  <th className="text-right px-6 py-3 font-semibold text-[var(--text-secondary)]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(team => (
                  <tr key={team.id} className="border-b border-[var(--gray-50)] hover:bg-[var(--gray-50)] transition-colors">
                    <td className="px-6 py-3">
                      {editingId === team.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            ref={editRef}
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveEdit(team.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            className="px-2 py-1 bg-[var(--bg)] rounded-md border border-[var(--primary)] text-sm text-[var(--text)] outline-none w-full max-w-[200px]"
                          />
                          <button onClick={() => saveEdit(team.id)} className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer">
                            <Check size={14} />
                          </button>
                          <button onClick={cancelEdit} className="p-1 text-[var(--text-muted)] hover:bg-[var(--bg)] rounded cursor-pointer">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => startEdit(team)}
                          className="font-medium text-[var(--text)] cursor-pointer hover:text-[var(--primary)] transition-colors"
                          title="Clique para editar"
                        >
                          {team.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-1 bg-[var(--bg)] rounded-full text-xs font-medium text-[var(--text-secondary)]">
                        {team.abbreviation}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-1.5">
                        <Shield size={12} className="text-[var(--primary)]" />
                        <span className="text-[var(--text-secondary)]">{team.league}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[var(--text-secondary)]">{team.city}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-[var(--gray-200)]"
                          style={{ backgroundColor: team.primary_color }}
                        />
                        <span className="text-xs text-[var(--text-muted)]">{team.primary_color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/times/${team.id}`}
                          className="px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg)] rounded-md transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteId(team.id)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/40">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 max-w-sm w-full mx-4 shadow-[var(--shadow-xl)]">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)] rounded-[var(--radius-md)] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] hover:bg-red-600 rounded-[var(--radius-md)] transition-colors cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
