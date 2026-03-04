'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, LogOut, ChevronRight, Loader2, Save, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import type { User as SupaUser } from '@supabase/supabase-js'

const menuItems = [
  {
    icon: Package,
    label: 'Meus Pedidos',
    description: 'Acompanhe seus pedidos',
    href: '/conta/pedidos',
  },
  {
    icon: Heart,
    label: 'Favoritos',
    description: 'Produtos que voce curtiu',
    href: '/conta/favoritos',
  },
  {
    icon: MapPin,
    label: 'Enderecos',
    description: 'Gerencie seus enderecos',
    href: '#',
  },
]

export default function ContaPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupaUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setName(data.user?.user_metadata?.full_name || '')
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSaveName = async () => {
    setSaving(true)
    setMessage('')
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    })
    if (error) {
      setMessage('Erro ao atualizar nome.')
    } else {
      setMessage('Nome atualizado com sucesso.')
      setEditing(false)
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setPasswordSaving(true)
    setMessage('')
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) {
      setMessage('Erro ao alterar senha.')
    } else {
      setMessage('Senha alterada com sucesso.')
      setChangingPassword(false)
      setNewPassword('')
    }
    setPasswordSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-[#2D3436] mb-8">
            Minha Conta
          </h1>

          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${
              message.includes('sucesso')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white text-2xl font-bold">
                {initial}
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3 py-1.5 bg-[#F8F9FE] rounded-lg border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7]"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      className="p-1.5 text-[#6C5CE7] hover:bg-[#6C5CE7]/10 rounded-lg"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setName(displayName) }}
                      className="text-xs text-[#636E72] hover:text-[#2D3436]"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-[#2D3436]">{displayName}</h2>
                )}
                <p className="text-sm text-[#636E72]">{user.email}</p>
              </div>
              {!editing && (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  Editar
                </Button>
              )}
            </div>

            {/* Change Password */}
            {changingPassword ? (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Nova Senha</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    className="flex-1 px-3 py-2 bg-[#F8F9FE] rounded-lg border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7]"
                  />
                  <Button size="sm" onClick={handleChangePassword} disabled={passwordSaving}>
                    {passwordSaving ? <Loader2 size={14} className="animate-spin" /> : 'Salvar'}
                  </Button>
                  <button
                    onClick={() => { setChangingPassword(false); setNewPassword('') }}
                    className="text-xs text-[#636E72] hover:text-[#2D3436]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setChangingPassword(true)}
                className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-[#636E72] hover:text-[#6C5CE7] transition-colors"
              >
                <KeyRound size={16} />
                Alterar senha
              </button>
            )}
          </div>

          {/* Menu */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 p-5 hover:bg-[#F8F9FE] transition-colors ${
                  index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center">
                  <item.icon size={20} className="text-[#6C5CE7]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#2D3436]">{item.label}</p>
                  <p className="text-xs text-[#636E72]">{item.description}</p>
                </div>
                <ChevronRight size={18} className="text-[#636E72]" />
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mt-6 text-[#FF6B6B] hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span className="font-medium">Sair da Conta</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
