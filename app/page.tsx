// app/page.tsx
import { prisma } from '@/lib/prisma'
import LandingPageClient from '@/components/LandingPageClient'

export const revalidate = 60; // Atualiza o cache a cada 60 segundos

export default async function LandingPage() {
  // 1. Busca os dados no servidor
  const batches = await prisma.batch.findMany({
    where: { isActive: true },
    orderBy: { order: 'desc' } 
  })

  // 2. Passa os dados para o componente cliente
  return <LandingPageClient batches={batches} />
}