import { Mail, MessageCircle, Clock } from 'lucide-react'

export default function ContatoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-2">Contato</h1>
      <p className="text-[#636E72] mb-10">Estamos aqui para ajudar! Escolha o canal de sua preferência.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="https://wa.me/5511999999999?text=Olá! Preciso de ajuda."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
            <MessageCircle size={24} className="text-[#25D366]" />
          </div>
          <div>
            <h2 className="font-bold text-[#2D3436]">WhatsApp</h2>
            <p className="text-sm text-[#636E72] mt-1">Resposta rápida em horário comercial</p>
            <p className="text-sm font-semibold text-[#25D366] mt-2">(11) 99999-9999</p>
          </div>
        </a>

        <a
          href="mailto:contato@draftsports.com.br"
          className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6C5CE7]/20 transition-colors">
            <Mail size={24} className="text-[#6C5CE7]" />
          </div>
          <div>
            <h2 className="font-bold text-[#2D3436]">E-mail</h2>
            <p className="text-sm text-[#636E72] mt-1">Respondemos em até 24 horas</p>
            <p className="text-sm font-semibold text-[#6C5CE7] mt-2">contato@draftsports.com.br</p>
          </div>
        </a>
      </div>

      <div className="mt-8 p-6 bg-[#F8F9FE] rounded-2xl flex items-start gap-3">
        <Clock size={20} className="text-[#6C5CE7] mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-[#2D3436]">Horário de Atendimento</p>
          <p className="text-sm text-[#636E72] mt-1">Segunda a Sexta: 9h às 18h</p>
          <p className="text-sm text-[#636E72]">Sábado: 9h às 13h</p>
        </div>
      </div>
    </div>
  )
}
