import type { Prisma } from '@prisma/client';

type Role = Prisma.RoleCreateArgs['data'];

export const roles: Role[] = [
  { name: 'admin' },
  { name: 'user', default: true, description: 'Default' },
];
