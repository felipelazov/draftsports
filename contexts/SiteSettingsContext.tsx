'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type {
  SiteLinks,
  ThemeColors,
  StoreInfo,
  HomepageSections,
  HomepageFeatures,
  NewsletterConfig,
  ProductConfig,
  CheckoutConfig,
  FooterConfig,
  InstitutionalPageConfig,
  FaqPageConfig,
  SizeGuideConfig,
  ContactPageConfig,
} from '@/types'

const defaultLinks: SiteLinks = {
  whatsapp_number: '5511999999999',
  whatsapp_message: 'Olá! Vim pelo site DRAFT e gostaria de mais informações.',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  email: 'contato@draftsports.com.br',
}

const defaultStoreInfo: StoreInfo = {
  name: 'DRAFT',
  description: 'A melhor loja de camisas esportivas americanas do Brasil. Autenticidade e estilo em cada peça.',
  copyright: '© 2026 DRAFT. Todos os direitos reservados.',
}

const defaultSections: HomepageSections = {
  categories_title: 'Escolha sua liga',
  categories_subtitle: 'As maiores ligas esportivas do mundo em um só lugar',
  featured_title: 'Destaques da semana',
  featured_subtitle: 'Os produtos mais populares escolhidos para você',
  live_title: 'Jogos ao Vivo',
  live_subtitle: 'Acompanhe os jogos de hoje e vista a camisa do seu time',
  new_arrivals_title: 'Novos lançamentos',
  new_arrivals_subtitle: 'As últimas camisas que acabaram de chegar',
  new_arrivals_cta: 'Ver Todo o Catálogo',
}

const defaultFeatures: HomepageFeatures = {
  items: [
    { icon: 'Truck', title: 'Frete Grátis', description: 'Em compras acima de R$ 299' },
    { icon: 'Shield', title: '100% Original', description: 'Garantia de autenticidade' },
    { icon: 'RotateCcw', title: 'Troca Fácil', description: '30 dias para trocar' },
    { icon: 'Zap', title: 'Entrega Rápida', description: 'Receba em até 5 dias' },
  ],
}

const defaultNewsletter: NewsletterConfig = {
  title: 'Receba ofertas exclusivas',
  subtitle: 'Cadastre-se e ganhe 10% de desconto na primeira compra',
  button_text: 'Inscrever',
}

const defaultProductConfig: ProductConfig = {
  benefits: [
    { icon: 'Truck', title: 'Frete Gratis', subtitle: 'Acima de R$ 299' },
    { icon: 'Shield', title: '100% Original', subtitle: 'Garantia total' },
    { icon: 'RotateCcw', title: 'Troca Facil', subtitle: 'Ate 30 dias' },
  ],
  installments: 3,
  out_of_stock_title: 'Produto esgotado',
  out_of_stock_message: 'Deixe seu e-mail e avisaremos quando este produto voltar.',
}

const defaultCheckoutConfig: CheckoutConfig = {
  pix_discount_percent: 5,
  free_shipping_min: 299,
  shipping_regions: [
    { name: 'SP', cep_start: 0, cep_end: 1, price: 0, days: 5 },
    { name: 'RJ/MG/ES', cep_start: 2, cep_end: 3, price: 14.90, days: 7 },
    { name: 'Sul/Centro-Oeste', cep_start: 4, cep_end: 5, price: 24.90, days: 10 },
    { name: 'Norte/Nordeste', cep_start: 6, cep_end: 9, price: 34.90, days: 12 },
  ],
  coupons: [
    { code: 'PRIMEIRACOMPRA', type: 'percent', value: 10, active: true },
    { code: 'DRAFT10', type: 'percent', value: 10, active: true },
    { code: 'DRAFT20', type: 'fixed', value: 20, active: true },
  ],
  security_seals: [
    { icon: 'Lock', text: 'Compra Segura' },
    { icon: 'Check', text: 'Dados Protegidos' },
    { icon: 'CreditCard', text: 'Mercado Pago' },
  ],
}

const defaultPageSobre: InstitutionalPageConfig = {
  title: 'Sobre a DRAFT',
  intro: 'A DRAFT nasceu da paixão pelo esporte e pela cultura das ligas americanas. Somos a loja referência em camisas esportivas de NBA, NFL, MLB, NHL e Futebol no Brasil.',
  sections: [
    { title: 'Nossa Missão', content: 'Trazer para o torcedor brasileiro as melhores camisas esportivas do mundo com qualidade premium, preços acessíveis e entrega rápida para todo o país.' },
    { title: 'Qualidade Garantida', content: 'Trabalhamos apenas com fornecedores certificados e cada peça passa por rigoroso controle de qualidade. Nossos produtos são confeccionados com tecidos de alta performance, ideais para uso no dia a dia e na prática esportiva.' },
    { title: 'Compromisso com o Cliente', content: 'Oferecemos atendimento humanizado, política de trocas facilitada e diversas formas de pagamento. Sua satisfação é a nossa prioridade.' },
  ],
}

const defaultPagePrivacidade: InstitutionalPageConfig = {
  title: 'Política de Privacidade',
  intro: 'Última atualização: Março de 2026',
  sections: [
    { title: '1. Informações que Coletamos', content: 'Coletamos informações que você nos fornece diretamente, como nome, e-mail, endereço de entrega e dados de pagamento ao realizar uma compra.' },
    { title: '2. Como Usamos suas Informações', content: '- Processar e entregar seus pedidos\n- Enviar confirmações e atualizações de pedido\n- Comunicar promoções e novidades (com seu consentimento)\n- Melhorar nossos produtos e serviços' },
    { title: '3. Segurança dos Dados', content: 'Utilizamos criptografia SSL e processamento de pagamento via Mercado Pago. Não armazenamos dados de cartão de crédito em nossos servidores.' },
    { title: '4. Compartilhamento', content: 'Não vendemos suas informações pessoais. Compartilhamos dados apenas com parceiros essenciais para a operação (processamento de pagamento e entrega).' },
    { title: '5. Seus Direitos', content: 'Conforme a LGPD, você tem direito a acessar, corrigir, excluir seus dados pessoais ou revogar consentimento a qualquer momento entrando em contato conosco.' },
    { title: '6. Cookies', content: 'Utilizamos cookies para melhorar sua experiência de navegação, manter sua sessão ativa e lembrar suas preferências.' },
  ],
}

const defaultPageTermos: InstitutionalPageConfig = {
  title: 'Termos de Uso',
  intro: 'Última atualização: Março de 2026',
  sections: [
    { title: '1. Aceitação dos Termos', content: 'Ao acessar e utilizar o site DRAFT, você concorda com estes termos de uso. Caso não concorde, não utilize nossos serviços.' },
    { title: '2. Produtos e Preços', content: 'Os preços exibidos no site são em Reais (BRL) e podem ser alterados sem aviso prévio. Nos esforçamos para manter as informações atualizadas, mas erros podem ocorrer.' },
    { title: '3. Pagamento', content: 'Aceitamos pagamento via cartão de crédito, débito e PIX. O processamento é realizado pelo Mercado Pago com total segurança.' },
    { title: '4. Entrega', content: 'Os prazos de entrega são estimados e podem variar conforme a região. Não nos responsabilizamos por atrasos causados pelos Correios ou transportadoras.' },
    { title: '5. Propriedade Intelectual', content: 'Todo o conteúdo do site (textos, imagens, logos, design) é propriedade da DRAFT e protegido por leis de direitos autorais.' },
    { title: '6. Conta do Usuário', content: 'Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.' },
  ],
}

const defaultPageTrocas: InstitutionalPageConfig = {
  title: 'Trocas e Devoluções',
  intro: '',
  sections: [
    { title: 'Prazo para Troca', content: 'Você tem até 30 dias após o recebimento do produto para solicitar a troca. O produto deve estar em perfeitas condições, sem uso, com etiquetas originais e na embalagem original.' },
    { title: 'Como Solicitar', content: '1. Acesse Minha Conta → Pedidos\n2. Selecione o pedido que deseja trocar\n3. Entre em contato pelo nosso WhatsApp informando o número do pedido\n4. Envie o produto para o endereço que informaremos\n5. Após recebermos e conferirmos, enviaremos o novo produto' },
    { title: 'Devolução e Reembolso', content: 'Caso prefira o reembolso, o valor será devolvido na mesma forma de pagamento utilizada na compra em até 10 dias úteis após o recebimento do produto devolvido.' },
    { title: 'Produtos com Defeito', content: 'Se o produto apresentar defeito de fabricação, entre em contato imediatamente. Neste caso, o frete de devolução é por nossa conta e você pode escolher entre troca ou reembolso integral.' },
  ],
  note: { title: 'Importante:', content: 'Produtos personalizados (com nome/número customizado) não são elegíveis para troca, exceto em caso de defeito.' },
}

const defaultPageFaq: FaqPageConfig = {
  title: 'Perguntas Frequentes',
  subtitle: 'Encontre respostas para as dúvidas mais comuns.',
  categories: [
    { category: 'Produtos', questions: [
      { q: 'As camisas são originais?', a: 'Sim, trabalhamos com fornecedores certificados e todas as peças passam por controle de qualidade rigoroso. Garantimos a autenticidade e qualidade de cada produto.' },
      { q: 'Qual a diferença entre os tipos de camisa (Titular, Reserva, Retro)?', a: 'A camisa Titular é o modelo principal usado pelo time na temporada. A Reserva é o modelo alternativo. A Retro são edições comemorativas de temporadas passadas.' },
      { q: 'Os tamanhos seguem padrão brasileiro ou americano?', a: 'Nossas camisas seguem o padrão americano. Recomendamos consultar nosso Guia de Tamanhos para encontrar o tamanho ideal.' },
    ]},
    { category: 'Pagamento', questions: [
      { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartão de crédito (Visa, Mastercard, Amex), cartão de débito e PIX. No PIX você ganha 5% de desconto.' },
      { q: 'Posso parcelar minha compra?', a: 'Sim! Parcelamos em até 12x sem juros no cartão de crédito.' },
      { q: 'O pagamento é seguro?', a: 'Totalmente! Utilizamos o Mercado Pago para processar os pagamentos. Seus dados de cartão não ficam armazenados em nossos servidores.' },
    ]},
    { category: 'Entrega', questions: [
      { q: 'Qual o prazo de entrega?', a: 'O prazo varia conforme sua região. Geralmente entre 5 a 15 dias úteis para capitais e 10 a 20 dias úteis para demais regiões.' },
      { q: 'Vocês entregam para todo o Brasil?', a: 'Sim! Entregamos para todos os estados brasileiros.' },
      { q: 'Como rastrear meu pedido?', a: 'Após o envio, você receberá o código de rastreamento por e-mail. Também pode acompanhar na seção Minha Conta → Pedidos.' },
    ]},
    { category: 'Trocas e Devoluções', questions: [
      { q: 'Posso trocar se o tamanho não servir?', a: 'Sim! Você tem até 30 dias após o recebimento para solicitar a troca. O produto deve estar sem uso e com etiquetas originais.' },
      { q: 'Como solicitar uma troca?', a: 'Acesse Minha Conta → Pedidos, selecione o pedido e entre em contato pelo nosso WhatsApp com o número do pedido.' },
      { q: 'E se o produto chegar com defeito?', a: 'Neste caso o frete de devolução é por nossa conta. Você pode escolher entre troca ou reembolso integral. Entre em contato imediatamente.' },
    ]},
  ],
}

const defaultPageTamanhos: SizeGuideConfig = {
  title: 'Guia de Tamanhos',
  subtitle: 'Medidas em centímetros (cm). Nossas camisas seguem o padrão americano.',
  sizes: [
    { size: 'P', chest: '88-92', length: '68', shoulder: '42' },
    { size: 'M', chest: '96-100', length: '71', shoulder: '44' },
    { size: 'G', chest: '104-108', length: '74', shoulder: '47' },
    { size: 'GG', chest: '112-116', length: '77', shoulder: '50' },
    { size: 'XGG', chest: '120-124', length: '80', shoulder: '53' },
  ],
  instructions: [
    { label: 'Peito', text: 'Meça a circunferência na parte mais larga do peito, passando por baixo dos braços.' },
    { label: 'Comprimento', text: 'Meça da base do pescoço até a barra inferior da camisa.' },
    { label: 'Ombro', text: 'Meça de uma costura do ombro até a outra.' },
  ],
  tip: 'Se estiver entre dois tamanhos, recomendamos escolher o maior para um caimento mais confortável.',
}

const defaultPageContato: ContactPageConfig = {
  title: 'Contato',
  subtitle: 'Estamos aqui para ajudar! Escolha o canal de sua preferência.',
  whatsapp_number: '5511999999999',
  whatsapp_text: 'Resposta rápida em horário comercial',
  email: 'contato@draftsports.com.br',
  email_response_time: 'Respondemos em até 24 horas',
  hours: ['Segunda a Sexta: 9h às 18h', 'Sábado: 9h às 13h'],
}

const defaultFooterConfig: FooterConfig = {
  columns: [
    {
      title: 'Ligas',
      links: [
        { name: 'NBA', href: '/catalogo/nba' },
        { name: 'NFL', href: '/catalogo/nfl' },
        { name: 'MLB', href: '/catalogo/mlb' },
        { name: 'NHL', href: '/catalogo/nhl' },
        { name: 'Futebol', href: '/catalogo/futebol' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { name: 'Sobre Nós', href: '/sobre' },
        { name: 'Política de Privacidade', href: '/privacidade' },
        { name: 'Termos de Uso', href: '/termos' },
        { name: 'Trocas e Devoluções', href: '/trocas' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { name: 'Perguntas Frequentes', href: '/faq' },
        { name: 'Rastrear Pedido', href: '/conta/pedidos' },
        { name: 'Guia de Tamanhos', href: '/tamanhos' },
        { name: 'Contato', href: '/contato' },
      ],
    },
  ],
  payment_methods: ['PIX', 'Visa', 'Master', 'Amex'],
}

const themeVarMap: Record<string, string> = {
  primary: '--primary',
  primary_dark: '--primary-dark',
  primary_light: '--primary-light',
  accent: '--accent',
  success: '--success',
  warning: '--warning',
  info: '--info',
  bg: '--bg',
  bg_elevated: '--bg-elevated',
  bg_sunken: '--bg-sunken',
  card: '--card',
  text: '--text',
  text_secondary: '--text-secondary',
  text_muted: '--text-muted',
}

interface SiteSettingsContextType {
  links: SiteLinks
  storeInfo: StoreInfo
  sections: HomepageSections
  features: HomepageFeatures
  newsletter: NewsletterConfig
  productConfig: ProductConfig
  checkoutConfig: CheckoutConfig
  footerConfig: FooterConfig
  pageSobre: InstitutionalPageConfig
  pagePrivacidade: InstitutionalPageConfig
  pageTermos: InstitutionalPageConfig
  pageTrocas: InstitutionalPageConfig
  pageFaq: FaqPageConfig
  pageTamanhos: SizeGuideConfig
  pageContato: ContactPageConfig
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  links: defaultLinks,
  storeInfo: defaultStoreInfo,
  sections: defaultSections,
  features: defaultFeatures,
  newsletter: defaultNewsletter,
  productConfig: defaultProductConfig,
  checkoutConfig: defaultCheckoutConfig,
  footerConfig: defaultFooterConfig,
  pageSobre: defaultPageSobre,
  pagePrivacidade: defaultPagePrivacidade,
  pageTermos: defaultPageTermos,
  pageTrocas: defaultPageTrocas,
  pageFaq: defaultPageFaq,
  pageTamanhos: defaultPageTamanhos,
  pageContato: defaultPageContato,
})

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<SiteLinks>(defaultLinks)
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStoreInfo)
  const [sections, setSections] = useState<HomepageSections>(defaultSections)
  const [features, setFeatures] = useState<HomepageFeatures>(defaultFeatures)
  const [newsletter, setNewsletter] = useState<NewsletterConfig>(defaultNewsletter)
  const [productConfig, setProductConfig] = useState<ProductConfig>(defaultProductConfig)
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>(defaultCheckoutConfig)
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(defaultFooterConfig)
  const [pageSobre, setPageSobre] = useState<InstitutionalPageConfig>(defaultPageSobre)
  const [pagePrivacidade, setPagePrivacidade] = useState<InstitutionalPageConfig>(defaultPagePrivacidade)
  const [pageTermos, setPageTermos] = useState<InstitutionalPageConfig>(defaultPageTermos)
  const [pageTrocas, setPageTrocas] = useState<InstitutionalPageConfig>(defaultPageTrocas)
  const [pageFaq, setPageFaq] = useState<FaqPageConfig>(defaultPageFaq)
  const [pageTamanhos, setPageTamanhos] = useState<SizeGuideConfig>(defaultPageTamanhos)
  const [pageContato, setPageContato] = useState<ContactPageConfig>(defaultPageContato)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.links) setLinks({ ...defaultLinks, ...data.links })
        if (data.store_info) setStoreInfo({ ...defaultStoreInfo, ...data.store_info })
        if (data.homepage_sections) setSections({ ...defaultSections, ...data.homepage_sections })
        if (data.homepage_features) setFeatures({ ...defaultFeatures, ...data.homepage_features })
        if (data.newsletter) setNewsletter({ ...defaultNewsletter, ...data.newsletter })
        if (data.product_config) setProductConfig({ ...defaultProductConfig, ...data.product_config })
        if (data.checkout_config) setCheckoutConfig({ ...defaultCheckoutConfig, ...data.checkout_config })
        if (data.footer_config) setFooterConfig({ ...defaultFooterConfig, ...data.footer_config })
        if (data.page_sobre) setPageSobre({ ...defaultPageSobre, ...data.page_sobre })
        if (data.page_privacidade) setPagePrivacidade({ ...defaultPagePrivacidade, ...data.page_privacidade })
        if (data.page_termos) setPageTermos({ ...defaultPageTermos, ...data.page_termos })
        if (data.page_trocas) setPageTrocas({ ...defaultPageTrocas, ...data.page_trocas })
        if (data.page_faq) setPageFaq({ ...defaultPageFaq, ...data.page_faq })
        if (data.page_tamanhos) setPageTamanhos({ ...defaultPageTamanhos, ...data.page_tamanhos })
        if (data.page_contato) setPageContato({ ...defaultPageContato, ...data.page_contato })
        if (data.theme) {
          const root = document.documentElement
          for (const [key, value] of Object.entries(data.theme)) {
            const varName = themeVarMap[key]
            if (varName && typeof value === 'string') {
              root.style.setProperty(varName, value)
            }
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ links, storeInfo, sections, features, newsletter, productConfig, checkoutConfig, footerConfig, pageSobre, pagePrivacidade, pageTermos, pageTrocas, pageFaq, pageTamanhos, pageContato }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
