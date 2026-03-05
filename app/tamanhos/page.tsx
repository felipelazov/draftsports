export default function TamanhosPage() {
  const sizes = [
    { size: 'P', chest: '88-92', length: '68', shoulder: '42' },
    { size: 'M', chest: '96-100', length: '71', shoulder: '44' },
    { size: 'G', chest: '104-108', length: '74', shoulder: '47' },
    { size: 'GG', chest: '112-116', length: '77', shoulder: '50' },
    { size: 'XGG', chest: '120-124', length: '80', shoulder: '53' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-2">Guia de Tamanhos</h1>
      <p className="text-[#636E72] mb-8">Medidas em centímetros (cm). Nossas camisas seguem o padrão americano.</p>

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
            {sizes.map((row) => (
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
          <li><strong className="text-[#2D3436]">Peito:</strong> Meça a circunferência na parte mais larga do peito, passando por baixo dos braços.</li>
          <li><strong className="text-[#2D3436]">Comprimento:</strong> Meça da base do pescoço até a barra inferior da camisa.</li>
          <li><strong className="text-[#2D3436]">Ombro:</strong> Meça de uma costura do ombro até a outra.</li>
        </ul>
        <div className="p-4 bg-[#F8F9FE] rounded-xl mt-6">
          <p className="font-medium text-[#2D3436]">Dica:</p>
          <p>Se estiver entre dois tamanhos, recomendamos escolher o maior para um caimento mais confortável.</p>
        </div>
      </div>
    </div>
  )
}
