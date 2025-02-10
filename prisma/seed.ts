// prisma/seed.js (hoặc scripts/create-admin.js)

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10; // Số vòng salt (càng cao càng an toàn, nhưng chậm hơn)

  await prisma.user.upsert({
    where: { username: 'admin' }, // Tìm kiếm tài khoản admin theo email
    update: {}, // Không cần cập nhật gì nếu tài khoản đã tồn tại
    create: {
      username: 'admin',
      name: 'Admin',
      hashedPassword: await bcrypt.hash('admin', saltRounds),
      role: 'ADMIN', // Gán vai trò admin
    },
  });

  await prisma.user.upsert({
    where: { username: 'worker1' },
    update: {},
    create: {
      username: 'worker1',
      name: 'Worker 1',
      hashedPassword: await bcrypt.hash('worker1', saltRounds),
      role: 'OPERATOR', // Gán vai trò admin
    },
  });
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
