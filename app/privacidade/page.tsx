export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-8">Política de Privacidade</h1>

      <div className="space-y-6 text-[#636E72] text-sm leading-relaxed">
        <p>Última atualização: Março de 2026</p>

        <section>
          <h2 className="text-lg font-bold text-[#2D3436] mb-2">1. Informações que Coletamos</h2>
          <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail, endereço de entrega e dados de pagamento ao realizar uma compra.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D3436] mb-2">2. Como Usamos suas Informações</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar confirmações e atualizações de pedido</li>
            <li>Comunicar promoções e novidades (com seu consentimento)</li>
            <li>Melhorar nossos produtos e serviços</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D3436] mb-2">3. Segurança dos Dados</h2>
          <p>Utilizamos criptografia SSL e processamento de pagamento via Mercado Pago. Não armazenamos dados de cartão de crédito em nossos servidores.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D3436] mb-2">4. Compartilhamento</h2>
          <p>Não vendemos suas informações pessoais. Compartilhamos dados apenas com parceiros essenciais para a operação (processamento de pagamento e entrega).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D3436] mb-2">5. Seus Direitos</h2>
          <p>Conforme a LGPD, você tem direito a acessar, corrigir, excluir seus dados pessoais ou revogar consentimento a qualquer momento entrando em contato conosco.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D3436] mb-2">6. Cookies</h2>
          <p>Utilizamos cookies para melhorar sua experiência de navegação, manter sua sessão ativa e lembrar suas preferências.</p>
        </section>
      </div>
    </div>
  )
}
