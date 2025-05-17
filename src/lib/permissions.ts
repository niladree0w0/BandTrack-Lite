
import type { User, UserRole, Permission } from './definitions';

/**
 * Checks if a user has a specific permission.
 * Relies on the `permissions` array already populated in the User object from AuthContext.
 * @param user The authenticated user object from useAuth(), which includes their roles and resolved permissions.
 * @param permissionToCheck The permission string to check for.
 * @returns True if the user has the permission, false otherwise.
 */
export const hasPermission = (user: User | undefined | null, permissionToCheck: Permission): boolean => {
  if (!user || !user.permissions) {
    return false;
  }

  // If user has 'fullAccess' permission (typically for admins), they have all permissions.
  if (user.permissions.includes('fullAccess')) {
    return true;
  }

  // Otherwise, check if the specific permission is in their list.
  return user.permissions.includes(permissionToCheck);
};
