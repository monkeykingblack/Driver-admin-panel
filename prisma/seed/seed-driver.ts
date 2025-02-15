import { faker } from '@faker-js/faker';
import { Gender, Prisma, PrismaClient } from '@prisma/client';

export async function seedDriver(prisma: PrismaClient) {
  for (let i = 0; i < 100; i++) {
    const driver: Prisma.DriverUncheckedCreateInput = {
      email: faker.internet.exampleEmail(),
      name: faker.person.fullName(),
      contactNo: faker.phone.number({ style: 'international' }),
      dateOfBirth: faker.date.birthdate({ mode: 'age', min: 18, max: 60 }),
      gender: Gender[faker.person.sex().toUpperCase() as keyof typeof Gender],
      status: 'APPROVED',
    };
    await prisma.driver.upsert({
      where: {
        email: driver.email,
      },
      update: {},
      create: {
        ...driver,
        vehicle: {
          create: {
            color: faker.vehicle.color(),
            plateNumber: faker.vehicle.vin(),
            model: faker.vehicle.model(),
          },
        },
      },
    });
  }
}
