import type { SuccessResult, ValidationResult } from 'remix-validated-form';
import { createValidator } from 'remix-validated-form';
import { z } from 'zod';

import type { ErrorLogEntry } from '~/models/errorLog.server';
import type { User, UserId } from '~/models/user.server';
import { throwResponse } from '~/utils/route';

export const INTENT_ENTRY_KEY = 'intent';
export type IntentEntryKey = typeof INTENT_ENTRY_KEY;

interface IntentDataType {
  [INTENT_ENTRY_KEY]: string;
}

export function invariantUser(
  user: User | null,
  request: Request,
): asserts user is User {
  if (user === null) {
    throwResponse('User not found', 404, request);
  }
}

export function invariantUserId(
  userId: UserId | null,
  request: Request,
): asserts userId is UserId {
  if (userId === null) {
    throwResponse('User not found', 404, request);
  }
}

export function invariantIntent<DataType>(
  result: ValidationResult<DataType>,
): asserts result is SuccessResult<DataType> {
  if (result.error !== undefined) {
    throw new Error(`Invalid intent ${result.submittedData[INTENT_ENTRY_KEY]}`);
  }
}

export function intentSchema<T extends string, U extends readonly [T, ...T[]]>(
  intentArr: U,
) {
  return z.object({ [INTENT_ENTRY_KEY]: z.enum(intentArr) });
}

export function getIntent<DataType extends IntentDataType>(
  result: SuccessResult<DataType>,
): DataType[IntentEntryKey] {
  return result.data[INTENT_ENTRY_KEY];
}

export const dummyValidator = createValidator({
  validate: async () => ({
    data: { dummy: undefined },
    error: undefined,
  }),
  validateField: async () => ({ error: undefined }),
});

export function invariantErrorLogEntry(
  errorLogEntry: ErrorLogEntry | null,
  request: Request,
): asserts errorLogEntry is ErrorLogEntry {
  if (errorLogEntry === null) {
    throwResponse('Error log entry not found', 404, request);
  }
}

export function assertUnreachable(x: never): never {
  throw new Error('Unreachable code');
}
