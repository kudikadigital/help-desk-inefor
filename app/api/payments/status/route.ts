import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const merchantTransactionId = searchParams.get('txId')

  if (!merchantTransactionId) {
    return NextResponse.json({ error: 'txId obrigatório' }, { status: 400 })
  }

  const payment = await prisma.payment.findUnique({
    where: { merchantTransactionId },
    select: { status: true, paidAt: true },
  })

  if (!payment) {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ status: payment.status, paidAt: payment.paidAt })
}
