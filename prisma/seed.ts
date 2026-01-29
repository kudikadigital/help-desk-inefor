import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

// Instanciamos um cliente separado para o seed
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // --- 1. Seed do Admin ---
  const adminExists = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    })
    console.log('✅ Admin criado: admin / admin123')
  } else {
    console.log('ℹ️ Admin já existe.')
  }

  // --- 2. Seed dos Lotes (Batches) ---
  const batches = [
    {
      id: 'lote-3',
      name: 'Lote 3 (Final)',
      price: 175000,
      discount: 20,
      slots: 100,
      order: 3,
      isFeatured: false,
    },
    {
      id: 'lote-2',
      name: 'Lote 2 (Intermédio)',
      price: 175000,
      discount: 40,
      slots: 50,
      order: 2,
      isFeatured: false,
    },
    {
      id: 'lote-1',
      name: 'Lote 1 (VIP)',
      price: 175000,
      discount: 50,
      slots: 87,
      order: 1,
      isFeatured: true,
    },
  ]

  for (const batch of batches) {
    await prisma.batch.upsert({
      where: { id: batch.id },
      update: {}, // Não faz nada se já existir
      create: batch,
    })
  }
  console.log('✅ Lotes criados/atualizados.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })