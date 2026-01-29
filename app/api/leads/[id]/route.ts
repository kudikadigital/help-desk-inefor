import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. No Next.js 15+, precisamos aguardar o params
    const { id } = await params 

    // 2. Ler o corpo da requisição
    const body = await request.json()
    const { status } = body

    console.log(`Tentando atualizar Lead ${id} para ${status}...`) // Log para debug

    if (!status) {
      return NextResponse.json({ error: 'Status obrigatório' }, { status: 400 })
    }

    // 3. Atualizar no Banco
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    })

    console.log('Sucesso:', updatedLead) // Log de sucesso
    return NextResponse.json({ success: true, lead: updatedLead })

  } catch (error) {
    console.error('ERRO NA API DE ATUALIZAÇÃO:', error) // Isso vai aparecer no seu terminal
    return NextResponse.json(
      { error: 'Erro interno ao atualizar.' },
      { status: 500 }
    )
  }
}