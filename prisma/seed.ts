import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { roles } from './data/roles';

const adminRoleName = 'admin';
const adminEmail = 'admin@techmodal.com';

async function seedUsers(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    // check env var exists
    const passwordKey = 'ADMIN_PASSWORD';
    const password = process.env[passwordKey];

    if (password === undefined) {
      throw new Error(`${passwordKey} env var not set`);
    }

    // add admin user if missing
    const hash = await bcrypt.hash(password, 10);

    const adminUserCreate: Prisma.UserCreateArgs['data'] = {
      email: adminEmail,
      username: adminRoleName,
      password: { create: { hash } },
    };

    const adminUser = await tx.user.upsert({
      create: adminUserCreate,
      update: {
        ...adminUserCreate,
        password: { upsert: { create: { hash }, update: { hash } } },
      },
      where: { email: adminEmail },
    });

    await Promise.all(
      roles.map((role) =>
        tx.role.upsert({
          create: role,
          update: role,
          where: { name: role.name },
        }),
      ),
    );

    // add admin role if missing
    const adminRole = await tx.role.upsert({
      create: { name: adminRoleName },
      update: {},
      where: { name: adminRoleName },
    });

    // add admin user role if missing
    const userRoleUpsert = {
      userId: adminUser.id,
      roleId: adminRole.id,
    };

    await tx.userRole.upsert({
      create: userRoleUpsert,
      update: userRoleUpsert,
      where: { userId_roleId: userRoleUpsert },
    });
  });
}

async function seed() {
  const prisma = new PrismaClient();

  try {
    await seedUsers(prisma);
    console.log('🌱 Database has been seeded');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
