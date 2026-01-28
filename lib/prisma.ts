import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

// 1. Definição do Singleton para evitar múltiplas instâncias em Dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const setupPrisma = () => {
  const connectionString = process.env.DATABASE_URL;
  
  // Criamos o Pool do Postgres
  const pool = new Pool({ connectionString });
  
  // Criamos o Adaptador exigido pelo motor "client" do Prisma 7
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });
};

// 2. Exportação ÚNICA da constante prisma
export const prisma = globalForPrisma.prisma || setupPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// --- Auto-Seed Admin ---
async function seedAdmin() {
  try {
    // IMPORTANTE: O build do Next.js pode tentar rodar isso sem DB
    const adminExists = await prisma.admin.findFirst();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });
      console.log("✅ Admin padrão verificado/criado.");
    }
  } catch (e) {
    // Silencioso no build
  }
}

// Rodar o seed
seedAdmin();