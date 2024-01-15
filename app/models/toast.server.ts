import { createId as cuid } from '@paralleldrive/cuid2';
import { redirect } from '@remix-run/node';
import { z } from 'zod';

import { combineHeaders, createCookieSessionStorage } from '~/utils/cookies';

const toastKey = 'toast';

const TypeSchema = z.enum(['message', 'success', 'error']);
const ToastSchema = z.object({
  description: z.string().optional(),
  id: z.string().default(() => cuid()),
  title: z.string(),
  type: TypeSchema.default('message'),
});

export type Toast = z.infer<typeof ToastSchema>;
type OptionalToast = z.input<typeof ToastSchema>;

const toastSessionStorage = createCookieSessionStorage('toast');

export async function createToastHeaders(optionalToast: OptionalToast) {
  const session = await toastSessionStorage.getSession();
  const toast = ToastSchema.parse(optionalToast);
  session.flash(toastKey, toast);
  const cookie = await toastSessionStorage.commitSession(session);
  return new Headers({ 'set-cookie': cookie });
}

export async function redirectWithToast(
  url: string,
  toast: OptionalToast,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
  });
}

export async function getToast(request: Request) {
  const session = await toastSessionStorage.getSession(
    request.headers.get('cookie'),
  );
  const result = ToastSchema.safeParse(session.get(toastKey));
  const toast = result.success ? result.data : null;
  return {
    toast,
    headers:
      toast !== null
        ? new Headers({
            'set-cookie': await toastSessionStorage.destroySession(session),
          })
        : undefined,
  };
}
