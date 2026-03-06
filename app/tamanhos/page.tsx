'use client'

import { useSiteSettings } from '@/contexts/SiteSettingsContext'

export default function TamanhosPage() {
  const { pageTamanhos } = useSiteSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-2">{pageTamanhos.title}</h1>
      <p className="text-[#636E72] mb-8">{pageTamanhos.subtitle}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F9FE]">
              <th className="px-6 py-3 text-left font-bold text-[#2D3436] rounded-tl-xl">Tamanho</th>
              <th className="px-6 py-3 text-left font-bold text-[#2D3436]">Peito</th>
              <th className="px-6 py-3 text-left font-bold text-[#2D3436]">Comprimento</th>
              <th className="px-6 py-3 text-left font-bold text-[#2D3436] rounded-tr-xl">Ombro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageTamanhos.sizes.map((row) => (
              <tr key={row.size} className="hover:bg-[#F8F9FE]/50">
                <td className="px-6 py-3 font-bold text-[#6C5CE7]">{row.size}</td>
                <td className="px-6 py-3 text-[#636E72]">{row.chest}</td>
                <td className="px-6 py-3 text-[#636E72]">{row.length}</td>
                <td className="px-6 py-3 text-[#636E72]">{row.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4 text-sm text-[#636E72]">
        <h2 className="text-lg font-bold text-[#2D3436]">Como Medir</h2>
        <ul className="list-disc list-inside space-y-2">
          {pageTamanhos.instructions.map((inst, i) => (
            <li key={i}>
              <strong className="text-[#2D3436]">{inst.label}:</strong> {inst.text}
            </li>
          ))}
        </ul>
        {pageTamanhos.tip && (
          <div className="p-4 bg-[#F8F9FE] rounded-xl mt-6">
            <p className="font-medium text-[#2D3436]">Dica:</p>
            <p>{pageTamanhos.tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
