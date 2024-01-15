import { createCookieSessionStorage as RemixCreateCookieSessionStorage } from '@remix-run/node';
import invariant from 'tiny-invariant';

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: Array<ResponseInit['headers'] | null | undefined>
) {
  const combined = new Headers();
  for (const header of headers) {
    if (header === null) {
      continue;
    }
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

export function createCookieSessionStorage(name: string) {
  invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

  return RemixCreateCookieSessionStorage({
    cookie: {
      name,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET],
      secure: process.env.DEPLOY_STAGE === 'production',
    },
  });
}
