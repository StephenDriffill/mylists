import type { Password, User as PrismaUser, RoleName } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { prisma } from '~/db.server';
import { compareHashPassword, hashPassword } from '~/utils/auth';

import { roleSelect } from './role.server';

type UserCreate = Pick<PrismaUser, 'email' | 'username' | 'resetPassword'> & {
  createdBy: User['username'];
  password: string;
  roles?: RoleName[];
};

type UserUpdate = Partial<Omit<UserCreate, 'createdBy'>> & {
  updatedBy: User['username'];
};

type UserFindResult = NonNullable<
  Prisma.Result<typeof prisma.user, { select: typeof userSelect }, 'findFirst'>
>;

export type User = ReturnType<typeof transformUser>;
export type UserId = PrismaUser['id'];

// exclude "id" for security reasons
const userSelect = Prisma.validator<Prisma.UserSelect>()({
  username: true,
  email: true,
  resetPassword: true,
  locked: true,
  failedLoginAttempts: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
  userRoles: { select: { role: { select: roleSelect } } },
});

const MAX_LOGIN_ATTEMPTS = 5;
const MIN_LOGIN_ATTEMPTS_WARNING = MAX_LOGIN_ATTEMPTS - 3;

function transformUser(user: UserFindResult) {
  const { userRoles, ...userWithoutRoles } = user;
  const roles = userRoles.map((userRole) => ({ ...userRole.role }));

  return {
    ...userWithoutRoles,
    roles,
  };
}

export async function getUsers() {
  const users = await prisma.user.findMany({ select: userSelect });
  const transformedUsers = users.map(transformUser);

  return transformedUsers;
}

export async function getUserById(id: UserId) {
  const user = await prisma.user.findUnique({
    select: userSelect,
    where: { id },
  });

  if (user === null) {
    return null;
  }

  return transformUser(user);
}

export async function getUserByUsername(username: PrismaUser['username']) {
  const user = await prisma.user.findFirst({
    select: userSelect,
    where: { username: { equals: username, mode: 'insensitive' } },
  });

  if (user === null) {
    return null;
  }

  return transformUser(user);
}

export async function getUserIdByUsername(username: PrismaUser['username']) {
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { username: { equals: username, mode: 'insensitive' } },
  });

  return user?.id ?? null;
}

export async function getUserIdByEmail(email: PrismaUser['email']) {
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { email: { equals: email, mode: 'insensitive' } },
  });

  return user?.id ?? null;
}

export async function createUser({
  createdBy,
  password,
  roles,
  ...rest
}: UserCreate) {
  return await prisma.user.create({
    data: {
      createdBy,
      updatedBy: createdBy,
      ...rest,
      password: {
        create: {
          hash: await hashPassword(password),
        },
      },
      ...(roles !== undefined && roles.length > 0
        ? {
            userRoles: {
              create: roles.map((role) => ({
                role: { connect: { name: role } },
              })),
            },
          }
        : {}),
    },
  });
}

export async function updateUser(
  id: UserId,
  { password, roles, ...rest }: UserUpdate,
) {
  const emptyPassword = password === '' || password === undefined;

  return await prisma.user.update({
    where: { id },
    data: {
      ...(!emptyPassword
        ? {
            password: {
              update: {
                hash: await hashPassword(password),
              },
            },
          }
        : {}),
      ...(roles !== undefined
        ? {
            userRoles: {
              deleteMany: {},
              create: roles.map((role) => ({
                role: { connect: { name: role } },
              })),
            },
          }
        : {}),
      ...rest,
    },
  });
}

export async function deleteUser(id: UserId) {
  return await prisma.user.delete({ where: { id } });
}

export async function deleteUserByEmail(email: PrismaUser['email']) {
  return await prisma.user.delete({ where: { email } });
}

export async function deleteUserByUsername(username: PrismaUser['username']) {
  return await prisma.user.delete({ where: { username } });
}

export async function resetPassword(id: UserId, password: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      password: true,
    },
  });

  if (user === null || user.password === null) {
    return {
      user: null,
      error: 'User not found.',
    };
  }

  const passwordsMatch = await compareHashPassword(
    password,
    user.password.hash,
  );

  if (passwordsMatch) {
    return {
      user: null,
      error: 'New password must be different from old password.',
    };
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      password: {
        update: {
          hash: await hashPassword(password),
        },
      },
      resetPassword: false,
    },
  });

  return {
    user: updatedUser,
    error: null,
  };
}

export async function verifyLogin(
  usernameOrEmail: PrismaUser['username'] | PrismaUser['email'],
  password: Password['hash'],
) {
  const Error = {
    Incorrect: 'Incorrect username or password',
    Locked: 'This account has been locked',
  } as const;

  const identifier = usernameOrEmail.includes('@') ? 'email' : 'username';
  const userWithPassword = await prisma.user.findFirst({
    where: { [identifier]: { equals: usernameOrEmail, mode: 'insensitive' } },
    include: {
      password: true,
    },
  });

  if (userWithPassword === null || userWithPassword.password === null) {
    return {
      user: null,
      error: Error.Incorrect,
    };
  }

  if (userWithPassword.locked) {
    await recordFailedLogin(userWithPassword.id);
    return {
      user: null,
      error: Error.Locked,
    };
  }

  const isValid = await compareHashPassword(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    await recordFailedLogin(userWithPassword.id);

    const attempt = userWithPassword.failedLoginAttempts + 1;
    const maxAttemptsExceeded = attempt >= MAX_LOGIN_ATTEMPTS;
    const showWarning = attempt >= MIN_LOGIN_ATTEMPTS_WARNING;
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempt;

    const error = maxAttemptsExceeded
      ? Error.Locked
      : showWarning
        ? `${Error.Incorrect}, ${remainingAttempts} ${
            remainingAttempts === 1 ? 'attempt' : 'attempts'
          } remaining`
        : Error.Incorrect;

    return {
      user: null,
      error,
    };
  }

  await recordSuccessfulLogin(userWithPassword.id);

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return {
    user: userWithoutPassword,
    error: null,
  };
}

export async function recordFailedLogin(id: UserId) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { failedLoginAttempts: true, locked: true },
  });

  if (user === null) {
    return null;
  }

  return await prisma.user.update({
    where: { id },
    data: {
      failedLoginAttempts: {
        increment: 1,
      },
      locked: user.locked || user.failedLoginAttempts + 1 >= MAX_LOGIN_ATTEMPTS,
    },
  });
}

export async function recordSuccessfulLogin(id: UserId) {
  // timestamp last login and reset failed attempts
  return await prisma.user.update({
    where: { id },
    data: {
      failedLoginAttempts: 0,
      lastLogin: new Date(),
    },
  });
}
