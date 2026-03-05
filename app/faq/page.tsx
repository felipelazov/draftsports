'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    category: 'Produtos',
    questions: [
      {
        q: 'As camisas são originais?',
        a: 'Sim, trabalhamos com fornecedores certificados e todas as peças passam por controle de qualidade rigoroso. Garantimos a autenticidade e qualidade de cada produto.',
      },
      {
        q: 'Qual a diferença entre os tipos de camisa (Titular, Reserva, Retro)?',
        a: 'A camisa Titular é o modelo principal usado pelo time na temporada. A Reserva é o modelo alternativo. A Retro são edições comemorativas de temporadas passadas.',
      },
      {
        q: 'Os tamanhos seguem padrão brasileiro ou americano?',
        a: 'Nossas camisas seguem o padrão americano. Recomendamos consultar nosso Guia de Tamanhos para encontrar o tamanho ideal.',
      },
    ],
  },
  {
    category: 'Pagamento',
    questions: [
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos cartão de crédito (Visa, Mastercard, Amex), cartão de débito e PIX. No PIX você ganha 5% de desconto.',
      },
      {
        q: 'Posso parcelar minha compra?',
        a: 'Sim! Parcelamos em até 12x sem juros no cartão de crédito.',
      },
      {
        q: 'O pagamento é seguro?',
        a: 'Totalmente! Utilizamos o Mercado Pago para processar os pagamentos. Seus dados de cartão não ficam armazenados em nossos servidores.',
      },
    ],
  },
  {
    category: 'Entrega',
    questions: [
      {
        q: 'Qual o prazo de entrega?',
        a: 'O prazo varia conforme sua região. Geralmente entre 5 a 15 dias úteis para capitais e 10 a 20 dias úteis para demais regiões.',
      },
      {
        q: 'Vocês entregam para todo o Brasil?',
        a: 'Sim! Entregamos para todos os estados brasileiros.',
      },
      {
        q: 'Como rastrear meu pedido?',
        a: 'Após o envio, você receberá o código de rastreamento por e-mail. Também pode acompanhar na seção Minha Conta → Pedidos.',
      },
    ],
  },
  {
    category: 'Trocas e Devoluções',
    questions: [
      {
        q: 'Posso trocar se o tamanho não servir?',
        a: 'Sim! Você tem até 30 dias após o recebimento para solicitar a troca. O produto deve estar sem uso e com etiquetas originais.',
      },
      {
        q: 'Como solicitar uma troca?',
        a: 'Acesse Minha Conta → Pedidos, selecione o pedido e entre em contato pelo nosso WhatsApp com o número do pedido.',
      },
      {
        q: 'E se o produto chegar com defeito?',
        a: 'Neste caso o frete de devolução é por nossa conta. Você pode escolher entre troca ou reembolso integral. Entre em contato imediatamente.',
      },
    ],
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left p-4 rounded-xl hover:bg-[#F8F9FE] transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-[#2D3436]">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-[#636E72] flex-shrink-0" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#636E72] mt-3 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-2">Perguntas Frequentes</h1>
      <p className="text-[#636E72] mb-10">Encontre respostas para as dúvidas mais comuns.</p>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-[#6C5CE7] mb-3">{section.category}</h2>
            <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100">
              {section.questions.map((item) => (
                <FaqItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
