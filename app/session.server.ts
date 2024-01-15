import { redirect } from '@remix-run/node';

import { redirectWithToast } from '~/models/toast.server';
import type { UserId } from '~/models/user.server';
import { getUserById } from '~/models/user.server';
import { createCookieSessionStorage } from '~/utils/cookies';

const USER_SESSION_KEY = 'userId';

export const sessionStorage = createCookieSessionStorage('__session');

// we have to do this because every time you commit the session you overwrite it
// so we store the expiration time in the cookie and reset it every time we commit
const originalCommitSession = sessionStorage.commitSession;

Object.defineProperty(sessionStorage, 'commitSession', {
  value: async function commitSession(
    ...args: Parameters<typeof originalCommitSession>
  ) {
    const [session, options] = args;
    if (options?.expires !== undefined) {
      session.set('expires', options.expires);
    }
    if (options?.maxAge !== undefined) {
      session.set('expires', new Date(Date.now() + options.maxAge * 1000));
    }
    const expires = session.has('expires')
      ? new Date(session.get('expires'))
      : undefined;
    const setCookieHeader = await originalCommitSession(session, {
      ...options,
      expires,
    });
    return setCookieHeader;
  },
});

async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

/**
 * Get `userId` from the session cookie.
 */
export async function getOptionalUserId(
  request: Request,
): Promise<UserId | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

/**
 * Get `userId` from the session cookie. If the user is not logged in,
 * force a redirect to the login route.
 */
export async function getRequiredUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getOptionalUserId(request);
  if (userId === undefined) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

/**
 * Get user from the database that matches `userId` from the session cookie.
 * If the user is not logged in, return `null`. If the user is locked, log them
 * out. If the user has their reset password flag set, redirect them to the reset
 * password route.
 */
export async function getOptionalUser(request: Request) {
  const RESET_PASSWORD_PATH = '/reset-password';
  const url = new URL(request.url);

  const userId = await getOptionalUserId(request);
  if (userId === undefined) {
    return null;
  }

  const user = await getUserById(userId);

  if (user === null || user.locked) {
    throw await logout(request, true);
  }

  if (user.resetPassword && url.pathname !== RESET_PASSWORD_PATH) {
    throw redirect(RESET_PASSWORD_PATH);
  }

  return user;
}

/**
 * Get user from the database that matches `userId` from the session cookie.
 * If the user is not logged in, redirect to the login route. If the user is locked,
 * log them out. If the user has their reset password flag set, redirect them to the reset
 * password route.
 */
export async function getRequiredUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const user = await getOptionalUser(request);
  if (user === null) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

export async function createUserSession({
  redirectTo,
  remember,
  request,
  userId,
}: {
  redirectTo: string;
  remember: boolean;
  request: Request;
  userId: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request, showToast = false) {
  const session = await getSession(request);
  const path = '/';
  const headers = {
    'Set-Cookie': await sessionStorage.destroySession(session),
  };

  if (showToast) {
    const toast = {
      title: 'You have been logged out.',
      type: 'error',
    } as const;

    return redirectWithToast(path, toast, { headers });
  }

  return redirect(path, { headers });
}
