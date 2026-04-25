import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  product: { name: string }
  quantity: number
  price: number
  size?: string
  color?: string
}

interface SendConfirmationParams {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  address: string
  postalCode: string
  city: string
}

export async function sendOrderConfirmation(params: SendConfirmationParams) {
  const { orderNumber, customerName, customerEmail, items, total, address, postalCode, city } = params

  const itemsHtml = items.map(item => {
    const details = [item.size, item.color].filter(Boolean).join(' · ')
    return `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #EDE5D8; color:#1A1512; font-size:14px;">
          ${item.product.name}${details ? ` <span style="color:#9E8E7C">(${details})</span>` : ''}
          × ${item.quantity}
        </td>
        <td style="padding:10px 0; border-bottom:1px solid #EDE5D8; text-align:right; color:#1A1512; font-size:14px; white-space:nowrap;">
          ${(item.price * item.quantity).toFixed(2)} €
        </td>
      </tr>
    `
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background-color:#FAFAF6; font-family:'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF6; padding:40px 20px;">
        <tr><td align="center">
          <table width="100%" style="max-width:560px; background:#ffffff; border:1px solid #EDE5D8;">

            <!-- Header -->
            <tr>
              <td style="padding:36px 40px 28px; border-bottom:1px solid #EDE5D8; text-align:center;">
                <p style="margin:0; font-size:28px; letter-spacing:4px; font-weight:700; color:#1A1512; font-family:Georgia, serif;">
                  DRESS BY ME
                </p>
                <p style="margin:6px 0 0; font-size:11px; letter-spacing:3px; color:#9E8E7C; text-transform:uppercase;">
                  Confirmation de commande
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 40px;">
                <p style="margin:0 0 8px; font-size:15px; color:#1A1512;">Bonjour ${customerName},</p>
                <p style="margin:0 0 24px; font-size:14px; color:#9E8E7C; line-height:1.6;">
                  Ta commande a bien été reçue et est en cours de préparation. Merci pour ta confiance !
                </p>

                <!-- Order number -->
                <div style="background:#F2EBE0; padding:14px 20px; margin-bottom:28px; text-align:center;">
                  <p style="margin:0; font-size:11px; letter-spacing:2px; color:#9E8E7C; text-transform:uppercase;">Numéro de commande</p>
                  <p style="margin:4px 0 0; font-size:20px; font-weight:700; color:#1A1512; font-family:Georgia, serif;">${orderNumber}</p>
                </div>

                <!-- Items -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHtml}
                  <tr>
                    <td style="padding:16px 0 0; font-size:15px; font-weight:700; color:#1A1512;">Total payé</td>
                    <td style="padding:16px 0 0; text-align:right; font-size:16px; font-weight:700; color:#8B7355;">${total.toFixed(2)} €</td>
                  </tr>
                </table>

                <!-- Delivery -->
                <div style="margin-top:28px; padding:16px 20px; border:1px solid #EDE5D8;">
                  <p style="margin:0 0 6px; font-size:11px; letter-spacing:2px; color:#9E8E7C; text-transform:uppercase;">Adresse de livraison</p>
                  <p style="margin:0; font-size:14px; color:#1A1512; line-height:1.6;">${address}<br>${postalCode} ${city}</p>
                </div>

                <!-- CTA -->
                <div style="margin-top:32px; text-align:center;">
                  <a href="https://dressbymee.shop/boutique/compte"
                     style="display:inline-block; background:#1A1512; color:#ffffff; text-decoration:none;
                            padding:14px 32px; font-size:12px; letter-spacing:3px; text-transform:uppercase;">
                    Suivre ma commande
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px; border-top:1px solid #EDE5D8; text-align:center;">
                <p style="margin:0; font-size:12px; color:#9E8E7C; line-height:1.7;">
                  Des questions ? Réponds directement à cet email ou contacte-nous sur<br>
                  ou sur Snapchat 👻 <strong>shopluxe31</strong><br>
                  Tu peux aussi répondre directement à cet email.
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  await resend.emails.send({
    from: 'Dress By Me <noreply@dressbymee.shop>',
    replyTo: 'dressbymee.support@gmail.com',
    to: customerEmail,
    subject: `Confirmation de ta commande ${orderNumber} 🎀`,
    html,
  })
}

export async function sendWelcomeEmail({ name, email }: { name: string; email: string }) {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background-color:#FAFAF6; font-family:'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF6; padding:40px 20px;">
        <tr><td align="center">
          <table width="100%" style="max-width:560px; background:#ffffff; border:1px solid #EDE5D8;">

            <!-- Header -->
            <tr>
              <td style="padding:36px 40px 28px; border-bottom:1px solid #EDE5D8; text-align:center;">
                <p style="margin:0; font-size:28px; letter-spacing:4px; font-weight:700; color:#1A1512; font-family:Georgia, serif;">
                  DRESS BY ME
                </p>
                <p style="margin:6px 0 0; font-size:11px; letter-spacing:3px; color:#9E8E7C; text-transform:uppercase;">
                  Bienvenue dans la communauté
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 40px;">
                <p style="margin:0 0 8px; font-size:15px; color:#1A1512;">Bonjour ${name} 🎀</p>
                <p style="margin:0 0 24px; font-size:14px; color:#9E8E7C; line-height:1.7;">
                  Ton compte Dress By Me a bien été créé. On est ravies de t'accueillir !<br>
                  Tu peux dès maintenant découvrir nos articles et passer ta première commande.
                </p>

                <div style="background:#F2EBE0; padding:20px 24px; margin-bottom:28px;">
                  <p style="margin:0 0 6px; font-size:11px; letter-spacing:2px; color:#9E8E7C; text-transform:uppercase;">Ton compte</p>
                  <p style="margin:0; font-size:14px; color:#1A1512;">${email}</p>
                </div>

                <div style="text-align:center; margin-bottom:28px;">
                  <a href="https://dressbymee.shop/boutique"
                     style="display:inline-block; background:#1A1512; color:#ffffff; text-decoration:none;
                            padding:14px 32px; font-size:12px; letter-spacing:3px; text-transform:uppercase;">
                    Découvrir la boutique
                  </a>
                </div>

                <p style="margin:0; font-size:13px; color:#9E8E7C; line-height:1.7; text-align:center;">
                  Des questions ? Réponds à cet email ou retrouve-nous sur<br>
                  Snapchat 👻 <strong style="color:#1A1512;">shopluxe31</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px; border-top:1px solid #EDE5D8; text-align:center;">
                <p style="margin:0; font-size:11px; color:#9E8E7C; letter-spacing:1px;">
                  dressbymee.shop
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  await resend.emails.send({
    from: 'Dress By Me <noreply@dressbymee.shop>',
    replyTo: 'dressbymee.support@gmail.com',
    to: email,
    subject: `Bienvenue chez Dress By Me ! 🎀`,
    html,
  })
}
