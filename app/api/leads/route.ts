// app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Evita múltiplas instâncias do Prisma em dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: Request) {
  try {
    // Em vez de .json(), usamos .formData() para lidar com arquivos
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const file = formData.get('paymentProof') as File | null

    // Validação do Passo 1
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios (Nome, Email, Telefone) estão faltando.' }, 
        { status: 400 }
      )
    }

    let paymentProofUrl = null

    // Lógica de "Upload" do Arquivo (Passo 2)
    if (file && file.size > 0) {
       // --- ÁREA DE UPLOAD REAL (Ex: AWS S3 / Vercel Blob) ---
       // const blob = await put(file.name, file, { access: 'public' });
       // paymentProofUrl = blob.url;
       
       // --- SIMULAÇÃO PARA FUNCIONAR LOCALMENTE ---
       console.log('Arquivo recebido:', file.name, file.type, file.size)
       // Salvamos apenas uma string simulando que o upload ocorreu
       paymentProofUrl = `/uploads/simulated/${Date.now()}-${file.name}`
    }

    // Criação ou Atualização (Upsert)
    // Se o email já existe, atualizamos o comprovativo se enviado agora.
    const lead = await prisma.lead.upsert({
        where: { email },
        update: {
            name,
            phone,
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