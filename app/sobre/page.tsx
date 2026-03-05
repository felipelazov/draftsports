import Link from 'next/link'

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-8">Sobre a DRAFT</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-[#636E72]">
        <p className="text-lg leading-relaxed">
          A <strong className="text-[#2D3436]">DRAFT</strong> nasceu da paixão pelo esporte e pela cultura das ligas americanas.
          Somos a loja referência em camisas esportivas de NBA, NFL, MLB, NHL e Futebol no Brasil.
        </p>

        <h2 className="text-xl font-bold text-[#2D3436] mt-8">Nossa Missão</h2>
        <p>
          Trazer para o torcedor brasileiro as melhores camisas esportivas do mundo com qualidade premium,
          preços acessíveis e entrega rápida para todo o país.
        </p>

        <h2 className="text-xl font-bold text-[#2D3436] mt-8">Qualidade Garantida</h2>
        <p>
          Trabalhamos apenas com fornecedores certificados e cada peça passa por rigoroso controle de qualidade.
          Nossos produtos são confeccionados com tecidos de alta performance, ideais para uso no dia a dia e na prática esportiva.
        </p>

        <h2 className="text-xl font-bold text-[#2D3436] mt-8">Compromisso com o Cliente</h2>
        <p>
          Oferecemos atendimento humanizado, política de trocas facilitada e diversas formas de pagamento.
          Sua satisfação é a nossa prioridade.
        </p>

        <div className="mt-12 p-6 bg-[#F8F9FE] rounded-2xl">
          <p className="text-sm text-[#636E72]">
            Tem alguma dúvida? <Link href="/faq" className="text-[#6C5CE7] font-semibold hover:underline">Acesse nosso FAQ</Link> ou
            entre em <Link href="/contato" className="text-[#6C5CE7] font-semibold hover:underline">contato conosco</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
