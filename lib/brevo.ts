interface BrevoPaymentConfirmation {
  email: string
  fullName: string
  courseName: string
  amount: number
  method: 'GPO' | 'REF'
  referenceNumber?: string
  referenceEntity?: string
  referenceExpiry?: string
  notifyEmail: string
  companyName: string
}

async function brevoRequest(apiKey: string, path: string, method: string, body: object) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok && res.status !== 204) {
    const error = await res.text()
    console.error(`Brevo ${path} error:`, error)
  }

  return res
}

export async function sendPaymentConfirmationEmail(
  apiKey: string,
  data: BrevoPaymentConfirmation
): Promise<void> {
  const isGPO = data.method === 'GPO'

  const htmlContent = isGPO
    ? `
    <h2>Pagamento confirmado!</h2>
    <p>Olá ${data.fullName},</p>
    <p>O seu pagamento foi processado com sucesso. A nossa equipa irá contactá-lo em breve para confirmar a matrícula.</p>
    <table>
      <tr><td><strong>Curso:</strong></td><td>${data.courseName}</td></tr>
      <tr><td><strong>Valor:</strong></td><td>${data.amount.toLocaleString('pt-AO')} Kz</td></tr>
      <tr><td><strong>Estado:</strong></td><td>✅ Pago</td></tr>
    </table>
    <p>Com os melhores cumprimentos,<br/>${data.companyName}</p>
  `
    : `
    <h2>Referência de pagamento gerada</h2>
    <p>Olá ${data.fullName},</p>
    <p>Efectue o pagamento até à data de validade para garantir a sua vaga.</p>
    <table>
      <tr><td><strong>Entidade:</strong></td><td>${data.referenceEntity}</td></tr>
      <tr><td><strong>Referência:</strong></td><td>${data.referenceNumber}</td></tr>
      <tr><td><strong>Valor:</strong></td><td>${data.amount.toLocaleString('pt-AO')} Kz</td></tr>
      <tr><td><strong>Validade:</strong></td><td>${data.referenceExpiry ? new Date(data.referenceExpiry).toLocaleDateString('pt-AO') : '—'}</td></tr>
    </table>
    <p>Após o pagamento, a nossa equipa irá confirmar a sua matrícula.</p>
    <p>Com os melhores cumprimentos,<br/>${data.companyName}</p>
  `

  // Email para o aluno
  await brevoRequest(apiKey, '/smtp/email', 'POST', {
    sender: { name: data.companyName, email: data.notifyEmail },
    to: [{ email: data.email, name: data.fullName }],
    subject: isGPO
      ? `Inscrição confirmada — ${data.courseName}`
      : `Referência de pagamento — ${data.courseName}`,
    htmlContent,
  })

  // Notificação interna
  await brevoRequest(apiKey, '/smtp/email', 'POST', {
    sender: { name: 'Sistema INEFOR', email: data.notifyEmail },
    to: [{ email: data.notifyEmail }],
    subject: `[${isGPO ? 'GPO PAGO ✅' : 'REF GERADA 🏦'}] ${data.fullName} — ${data.courseName} — ${data.amount.toLocaleString('pt-AO')} Kz`,
    htmlContent: `
      <h3>Nova inscrição ${isGPO ? 'paga' : '— referência gerada'}</h3>
      <p><strong>Aluno:</strong> ${data.fullName} (${data.email})</p>
      <p><strong>Curso:</strong> ${data.courseName}</p>
      <p><strong>Valor:</strong> ${data.amount.toLocaleString('pt-AO')} Kz</p>
      ${!isGPO ? `<p><strong>Entidade:</strong> ${data.referenceEntity} | <strong>Ref:</strong> ${data.referenceNumber}</p>` : ''}
    `,
  })
}

export async function sendWebhookPaidEmail(
  apiKey: string,
  data: {
    notifyEmail: string
    companyName: string
    fullName: string
    email: string
    courseName: string
    amount: number
  }
): Promise<void> {
  await brevoRequest(apiKey, '/smtp/email', 'POST', {
    sender: { name: 'Sistema INEFOR', email: data.notifyEmail },
    to: [{ email: data.notifyEmail }],
    subject: `[REF PAGA ✅] ${data.fullName} — ${data.courseName} — ${data.amount.toLocaleString('pt-AO')} Kz`,
    htmlContent: `
      <h3>Referência bancária paga com sucesso</h3>
      <p><strong>Aluno:</strong> ${data.fullName} (${data.email})</p>
      <p><strong>Curso:</strong> ${data.courseName}</p>
      <p><strong>Valor:</strong> ${data.amount.toLocaleString('pt-AO')} Kz</p>
    `,
  })
}
