'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateBatch(id: string, data: { price: number; discount: number; slots: number }) {
  try {
    await prisma.batch.update({
      where: { id },
      data: {
        price: data.price,
        discount: data.discount,
        slots: data.slots
      }
    })
    revalidatePath('/') // Atualiza a Landing Page
    revalidatePath('/admin/settings') // Atualiza o Admin
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao atualizar lote', details: error }
  }
}