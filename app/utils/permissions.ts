import type { RoleName } from '@prisma/client';

type Entity = 'user';
// manage encapsulates all actions
type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Access = 'own' | 'any'; // record created by current user or any user

export type Permission = `${Entity}:${Action}:${Access}`;
type Permissions = Partial<{ [key in RoleName]: Permission[] }>;

function parsePermission(permission: Permission) {
  const [entity, action, access] = permission.split(':') as [
    Entity,
    Action,
    Access,
  ];
  return { entity, action, access };
}

function getPermissionRoles(permission: Permission) {
  const permissionsToCheck = [permission];

  // 'manage' access implicitly includes 'create', 'read', 'update', 'delete'
  const { access, action, entity } = parsePermission(permission);
  if (['create', 'read', 'update', 'delete'].includes(action)) {
    permissionsToCheck.push(`${entity}:manage:${access}`);
  }

  // 'any' access implicitly includes 'own'
  permissionsToCheck.forEach((curr) => {
    const { access, action, entity } = parsePermission(curr);
    if (access === 'own') {
      permissionsToCheck.push(`${entity}:${action}:any`);
    }
  });

  // get all the roles that have the relevant permission
  return Object.entries(permissions)
    .filter(([, permissionList]) =>
      permissionList.some((permission) =>
        permissionsToCheck.includes(permission),
      ),
    )
    .map(([roleName]) => roleName);
}

export function hasPermission(permission: Permission, roles: RoleName[]) {
  const permissionRoles = getPermissionRoles(permission);
  return roles.some((userRole) => permissionRoles.includes(userRole));
}

const permissions: Permissions = {
  admin: ['user:manage:any'],
};
