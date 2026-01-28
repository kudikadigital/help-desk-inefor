import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const file = formData.get('paymentProof') as File | null

    // Validação dos campos obrigatórios
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios (Nome, Email, Telefone) estão faltando.' }, 
        { status: 400 }
      )
    }

    let paymentProofUrl = null

    // Lógica de "Upload" do Arquivo
    if (file && file.size > 0) {
       // --- SIMULAÇÃO PARA FUNCIONAR LOCALMENTE ---
       // Em produção, substitua isso pelo upload real (S3, Vercel Blob, etc.)
       console.log('Arquivo recebido:', file.name, file.type, file.size)
       paymentProofUrl = `/uploads/simulated/${Date.now()}-${file.name}`
    }

    // Criação ou Atualização (Upsert) usando a instância global do prisma
    const lead = await prisma.lead.upsert({
        where: { email },
        update: {
            name,
            phone,
            // Só atualiza o status se houver um novo comprovativo
            ...(paymentProofUrl ? { paymentProofUrl, status: 'AGUARDANDO_VALIDACAO' } : {})
        },
        create: {
            name,
            email,
            phone,
            paymentProofUrl,
            status: paymentProofUrl ? 'AGUARDANDO_VALIDACAO' : 'NOVO'
        }
    })

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 })

  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar inscrição.' }, 
      { status: 500 }
    )
  }
}