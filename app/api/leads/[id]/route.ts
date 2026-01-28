import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validação básica
    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório.' },
        { status: 400 }
      )
    }

    // Atualiza no banco
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, lead: updatedLead })

  } catch (error) {
    console.error('Erro ao atualizar lead:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar status.' },
      { status: 500 }
    )
  }
}