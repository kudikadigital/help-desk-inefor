import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
      installmentPrice: 72500,
      slots: 100,
      order: 3,
      isFeatured: false,
    },
    {
      id: 'lote-2',
      name: 'Lote 2 (Intermédio)',
      price: 175000,
      discount: 40,
      installmentPrice: 55000,
      slots: 50,
      order: 2,
      isFeatured: false,
    },
    {
      id: 'lote-1',
      name: 'Lote 1 (VIP)',
      price: 175000,
      discount: 50,
      installmentPrice: 45000,
      slots: 40,
      order: 1,
      isFeatured: true,
    },
  ]

  for (const batch of batches) {
    await prisma.batch.upsert({
      where: { id: batch.id },
      update: {
        price: batch.price,
        discount: batch.discount,
        installmentPrice: batch.installmentPrice,
        slots: batch.slots,
      },
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