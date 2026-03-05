export default function TrocasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-8">Trocas e Devoluções</h1>

      <div className="space-y-8 text-[#636E72]">
        <section>
          <h2 className="text-xl font-bold text-[#2D3436] mb-3">Prazo para Troca</h2>
          <p>
            Você tem até <strong className="text-[#2D3436]">30 dias</strong> após o recebimento do produto para solicitar a troca.
            O produto deve estar em perfeitas condições, sem uso, com etiquetas originais e na embalagem original.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D3436] mb-3">Como Solicitar</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Acesse <strong className="text-[#2D3436]">Minha Conta → Pedidos</strong></li>
            <li>Selecione o pedido que deseja trocar</li>
            <li>Entre em contato pelo nosso WhatsApp informando o número do pedido</li>
            <li>Envie o produto para o endereço que informaremos</li>
            <li>Após recebermos e conferirmos, enviaremos o novo produto</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D3436] mb-3">Devolução e Reembolso</h2>
          <p>
            Caso prefira o reembolso, o valor será devolvido na mesma forma de pagamento utilizada na compra
            em até <strong className="text-[#2D3436]">10 dias úteis</strong> após o recebimento do produto devolvido.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D3436] mb-3">Produtos com Defeito</h2>
          <p>
            Se o produto apresentar defeito de fabricação, entre em contato imediatamente.
            Neste caso, o frete de devolução é por nossa conta e você pode escolher entre troca ou reembolso integral.
          </p>
        </section>

        <div className="p-6 bg-[#F8F9FE] rounded-2xl">
          <p className="text-sm font-medium text-[#2D3436]">Importante:</p>
          <p className="text-sm mt-1">
            Produtos personalizados (com nome/número customizado) não são elegíveis para troca, exceto em caso de defeito.
          </p>
        </div>
      </div>
    </div>
  )
}
