import type { Prisma } from '@prisma/client';

import { prisma } from '~/db.server';
import { getOptionalUserId } from '~/session.server';

import { getUserById } from './user.server';

export type ErrorLogEntry = Awaited<ReturnType<typeof getErrorLog>>[number];

export async function getErrorLog() {
  return await prisma.errorLog.findMany();
}

export async function getErrorLogEntry(id: string) {
  return await prisma.errorLog.findUnique({
    where: {
      id,
    },
  });
}

function getErrorPropertyValue(error: object, property: string) {
  const errorProperty = (error as Record<string, unknown>)[property];
  return property in error
    ? typeof errorProperty === 'string'
      ? errorProperty
      : JSON.stringify(errorProperty)
    : undefined;
}

export async function logError(error: unknown, request?: Request) {
  let user;
  if (request !== undefined) {
    const userId = await getOptionalUserId(request);
    if (userId !== undefined) {
      user = await getUserById(userId);
    }
  }
  const createdBy =
    user !== undefined && user !== null ? user.username : undefined;

  const errorLogData: Prisma.ErrorLogCreateInput = {
    message: JSON.stringify(error),
    url: request?.url,
    createdBy,
  };

  if (typeof error === 'string') {
    errorLogData.message = error;
  } else if (error instanceof Error) {
    errorLogData.message = error.message;
    errorLogData.stack = error.stack;
    errorLogData.status = error.name;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    Object.keys(error).length > 0
  ) {
    errorLogData.message =
      getErrorPropertyValue(error, 'message') ?? JSON.stringify(error);
    errorLogData.stack = getErrorPropertyValue(error, 'stack');
    errorLogData.status =
      getErrorPropertyValue(error, 'status') ??
      getErrorPropertyValue(error, 'name');
  }

  await prisma.errorLog.create({ data: errorLogData });
}
