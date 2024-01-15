import { z } from 'zod';

export function optionalOrEmpty<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(z.literal(''));
}
