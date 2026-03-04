'use client'

import { useState } from 'react'
import { ShippingAddress } from '@/types'

interface AddressFormProps {
  address: Partial<ShippingAddress>
  onChange: (address: Partial<ShippingAddress>) => void
}

export function AddressForm({ address, onChange }: AddressFormProps) {
  const [loadingCep, setLoadingCep] = useState(false)

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    onChange({ ...address, zip: cleanCep })

    if (cleanCep.length === 8) {
      setLoadingCep(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          onChange({
            ...address,
            zip: cleanCep,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          })
        }
      } catch {
        // silently fail
      }
      setLoadingCep(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all'

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#2D3436]">Endereço de Entrega</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-[#636E72] mb-1.5">
            CEP
          </label>
          <div className="relative">
            <input
              type="text"
              value={address.zip || ''}
              onChange={(e) => handleCepChange(e.target.value)}
              placeholder="00000-000"
              maxLength={9}
              className={inputClass}
            />
            {loadingCep && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#636E72] mb-1.5">
          Rua
        </label>
        <input
          type="text"
          value={address.street || ''}
          onChange={(e) => onChange({ ...address, street: e.target.value })}
          placeholder="Nome da rua"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#636E72] mb-1.5">
            Número
          </label>
          <input
            type="text"
            value={address.number || ''}
            onChange={(e) => onChange({ ...address, number: e.target.value })}
            placeholder="Nº"
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[#636E72] mb-1.5">
            Complemento
          </label>
          <input
            type="text"
            value={address.complement || ''}
            onChange={(e) => onChange({ ...address, complement: e.target.value })}
            placeholder="Apto, bloco..."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#636E72] mb-1.5">
          Bairro
        </label>
        <input
          type="text"
          value={address.neighborhood || ''}
          onChange={(e) => onChange({ ...address, neighborhood: e.target.value })}
          placeholder="Bairro"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[#636E72] mb-1.5">
            Cidade
          </label>
          <input
            type="text"
            value={address.city || ''}
            onChange={(e) => onChange({ ...address, city: e.target.value })}
            placeholder="Cidade"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#636E72] mb-1.5">
            Estado
          </label>
          <input
            type="text"
            value={address.state || ''}
            onChange={(e) => onChange({ ...address, state: e.target.value })}
            placeholder="UF"
            maxLength={2}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
