import { PrismaClient } from '@prisma/client';

import { seedDriver } from './seed-driver';
import { seedUser } from './seed-user';

const prisma = new PrismaClient();

async function main() {
  await seedUser(prisma);
  await seedDriver(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
