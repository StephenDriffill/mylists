import { Prisma } from '@prisma/client';

import { prisma } from '~/db.server';

export type Role = Awaited<ReturnType<typeof getRoles>>[number];

export const roleSelect = Prisma.validator<Prisma.RoleSelect>()({
  name: true,
  description: true,
  default: true,
});

export async function getRoles() {
  return await prisma.role.findMany({ select: roleSelect });
}

export async function getUserRoleNames(userId: string) {
  const userRoles = await prisma.userRole.findMany({
    select: { role: { select: { name: true } } },
    where: { userId },
  });

  return userRoles.map((userRole) => userRole.role.name);
}
