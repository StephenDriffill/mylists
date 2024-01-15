import type { RoleName } from '@prisma/client';

import { prisma } from '~/db.server';
import { getRequiredUser, getRequiredUserId } from '~/session.server';
import type { Permission } from '~/utils/permissions';
import { hasPermission } from '~/utils/permissions';
import { throwResponse } from '~/utils/route';

import { getUserRoleNames } from './role.server';

/**
 * Ensure that the current user has the given role, otherwise throw a 403 error.
 */
export async function requireRole(request: Request, role: RoleName) {
  const userId = await getRequiredUserId(request);

  const userRole = await prisma.userRole.findFirst({
    select: { id: true },
    where: { userId, role: { name: role } },
  });

  if (userRole === null) {
    throwResponse(`Unauthorized - required role: ${role}`, 403, request);
  }
}

/**
 * Ensure that the current user is valid and has the given role, otherwise throw a 403 error.
 */
export async function requireUserWithRole(request: Request, role: RoleName) {
  await getRequiredUser(request);
  await requireRole(request, role);
}

/**
 * Ensure that the current user has the given permission as part of their
 * roles, otherwise throw a 403 error.
 */
export async function requirePermission(
  request: Request,
  permission: Permission,
) {
  const userId = await getRequiredUserId(request);
  const userRoleNames = await getUserRoleNames(userId);

  if (!hasPermission(permission, userRoleNames)) {
    throwResponse(
      `Unauthorized - required permission: ${permission}`,
      403,
      request,
    );
  }
}

/**
 * Ensure that the `accessCondition` is true, otherwise throw a 403 error.
 */
export async function requireAccess(
  request: Request,
  accessCondition: boolean,
  errorMessage = "Unauthorized - you don't have the required access",
) {
  if (!accessCondition) {
    throwResponse(errorMessage, 403, request);
  }
}
