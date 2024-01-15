import type { DataFunctionArgs } from '@remix-run/node';
import type { Params } from '@remix-run/react';

import { logError } from '~/models/errorLog.server';
import type { HttpStatusCode } from '~/utils/http';

export type TypedDataFunctionArgs<Key extends string> = Omit<
  DataFunctionArgs,
  'params'
> & {
  params: Params<Key>;
};

export function throwResponse(
  message: string,
  status: HttpStatusCode,
  request: Request,
): never {
  logError({ message, status }, request);
  throw new Response(message, { status });
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }
  if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  console.error('Unable to get error message for error', error);
  return 'Unknown Error';
}
