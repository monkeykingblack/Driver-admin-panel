import type { PrismaClient } from '@prisma/client';

import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUser(prisma: PrismaClient) {
  const saltRounds = 10;

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Admin',
      hashedPassword: await bcrypt.hash('admin@123', saltRounds),
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { username: 'worker1' },
    update: {},
    create: {
      username: 'worker1',
      name: 'Worker 1',
      hashedPassword: await bcrypt.hash('worker@123', saltRounds),
      role: Role.OPERATOR,
    },
  });
}
