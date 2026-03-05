const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.EMAIL_FROM || 'Draft Sports <noreply@draftsports.com.br>'

interface OrderEmailData {
  to: string
  customerName: string
  orderId: string
  total: number
  items: { name: string; quantity: number; size: string; price: number }[]
  paymentMethod: string
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log(`[Email] Sem RESEND_API_KEY — email nao enviado: ${subject} → ${to}`)
    return
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    })
  } catch (err) {
    console.error('[Email] Erro ao enviar:', err)
  }
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents)
}

function baseTemplate(title: string, content: string) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: linear-gradient(135deg, #6C5CE7, #A29BFE); padding: 32px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Draft Sports</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #2D3436; margin-top: 0;">${title}</h2>
        ${content}
      </div>
      <div style="background: #F8F9FE; padding: 20px; text-align: center; font-size: 12px; color: #636E72;">
        <p>Draft Sports — Camisas de futebol originais</p>
        <p>Duvidas? Fale conosco pelo WhatsApp ou email.</p>
      </div>
    </div>
  `
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = data.items
    .map(i => `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.name} (${i.size})</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(i.price * i.quantity)}</td>
    </tr>`)
    .join('')

  const content = `
    <p>Ola, <strong>${data.customerName}</strong>!</p>
    <p>Seu pedido <strong>#${data.orderId.substring(0, 8).toUpperCase()}</strong> foi recebido com sucesso.</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #F8F9FE;">
          <th style="padding: 8px; text-align: left;">Produto</th>
          <th style="padding: 8px; text-align: center;">Qtd</th>
          <th style="padding: 8px; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 12px 8px; font-weight: bold;">Total</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #6C5CE7;">${formatPrice(data.total)}</td>
        </tr>
      </tfoot>
    </table>

    <p style="color: #636E72;">Pagamento via <strong>${data.paymentMethod === 'pix' ? 'PIX' : 'Cartao'}</strong></p>
    <p style="color: #636E72;">Acompanhe seu pedido em <a href="https://draftsports.com.br/conta/pedidos/${data.orderId}" style="color: #6C5CE7;">Meus Pedidos</a>.</p>
  `

  await sendEmail(data.to, `Pedido #${data.orderId.substring(0, 8).toUpperCase()} confirmado!`, baseTemplate('Pedido Confirmado!', content))
}

export async function sendPaymentApproved(to: string, customerName: string, orderId: string) {
  const content = `
    <p>Ola, <strong>${customerName}</strong>!</p>
    <p>O pagamento do seu pedido <strong>#${orderId.substring(0, 8).toUpperCase()}</strong> foi <span style="color: #00B894; font-weight: bold;">aprovado</span>!</p>
    <p>Estamos preparando seu pedido para envio. Voce recebera o codigo de rastreamento assim que for despachado.</p>
    <p style="margin-top: 20px;">
      <a href="https://draftsports.com.br/conta/pedidos/${orderId}" style="background: #6C5CE7; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        Acompanhar Pedido
      </a>
    </p>
  `

  await sendEmail(to, `Pagamento aprovado — Pedido #${orderId.substring(0, 8).toUpperCase()}`, baseTemplate('Pagamento Aprovado!', content))
}

export async function sendOrderShipped(to: string, customerName: string, orderId: string, trackingCode: string) {
  const content = `
    <p>Ola, <strong>${customerName}</strong>!</p>
    <p>Seu pedido <strong>#${orderId.substring(0, 8).toUpperCase()}</strong> foi <span style="color: #6C5CE7; font-weight: bold;">enviado</span>!</p>
    <p>Codigo de rastreamento: <strong>${trackingCode}</strong></p>
    <p style="margin-top: 20px;">
      <a href="https://draftsports.com.br/conta/pedidos/${orderId}" style="background: #6C5CE7; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        Rastrear Pedido
      </a>
    </p>
  `

  await sendEmail(to, `Pedido enviado — #${orderId.substring(0, 8).toUpperCase()}`, baseTemplate('Pedido Enviado!', content))
}
