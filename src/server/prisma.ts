import { PrismaClient } from '@prisma/client';

const prismaClientSigleton = () => {
  return new PrismaClient();
};

const globalForPrisma = global as unknown as { prisma?: ReturnType<typeof prismaClientSigleton> };

export const prisma = globalForPrisma.prisma ?? prismaClientSigleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
