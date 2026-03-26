export type PaymentMethod = 'GPO' | 'REF'

interface AppyPayConfig {
  clientId: string
  clientSecret: string
  resource: string
  gpoMethodId: string
  refMethodId: string
}

interface AppyPayToken {
  access_token: string
  expires_in: number
}

// AJUSTADO: Removido phoneNumber da raiz e adicionado paymentInfo
interface AppyPayChargePayload {
  merchantTransactionId: string
  amount: number
  currency: string
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
  paymentInfo?: {
    phoneNumber: string
  }
}

export interface AppyPayChargeResult {
  id: string
  responseStatus: {
    successful: boolean
    status: string
    code: number
    message: string
    source: string
    reference?: {
      referenceNumber: string
      dueDate: string
      entity: string
    } | null
  }
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getToken(config: AppyPayConfig): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    resource: config.resource,
  })

  const res = await fetch(
    'https://login.microsoftonline.com/auth.appypay.co.ao/oauth2/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  )

  if (!res.ok) throw new Error(`AppyPay auth failed: ${res.status}`)

  const data: AppyPayToken = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.token
}

export async function createCharge(
  config: AppyPayConfig,
  payload: AppyPayChargePayload
): Promise<AppyPayChargeResult> {
  const token = await getToken(config)

  // O log de debug agora mostrará a estrutura correta com paymentInfo
  console.log("PAYLOAD ENVIADO PARA APPYPAY:", JSON.stringify(payload, null, 2));

  const res = await fetch('https://gwy-api.appypay.co.ao/v2.0/charges', {
    method: 'POST',
    headers: {
      'Accept': 'application/json', // Boa prática adicionar
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`AppyPay charge failed: ${res.status} — ${error}`)
  }

  return res.json()
}

export function buildConfig(): AppyPayConfig {
  return {
    clientId: process.env.APPYPAY_CLIENT_ID!,
    clientSecret: process.env.APPYPAY_CLIENT_SECRET!,
    resource: process.env.APPYPAY_RESOURCE!,
    gpoMethodId: process.env.APPYPAY_GPO_METHOD_ID!,
    refMethodId: process.env.APPYPAY_REF_METHOD_ID!,
  }
}

export function getMethodId(config: AppyPayConfig, method: PaymentMethod): string {
  return method === 'GPO' ? config.gpoMethodId : config.refMethodId
}

export function generateMerchantTransactionId(): string {
  return `HD${Date.now().toString(36).toUpperCase().slice(-8)}${Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase()}`
}