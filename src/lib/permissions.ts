
import type { UserRole } from './definitions';

// Define more granular permissions as your app grows.
export type Permission = 
  | 'viewDashboard'
  | 'manageDispatch'
  | 'manageReturns'
  | 'viewEmployees'
  | 'manageEmployees' // Covers Add, Edit, Delete for employees/subcontractors
  | 'viewProfile'
  | 'manageSettings'
  // | 'administerUsers' // Example for future user management by admin
  // | 'configurePermissions' // Example for admin toggling permissions
  | 'fullAccess'; // Special permission for Admin

/**
 * Checks if a user with a given role has a specific permission.
 * @param role The role of the user.
 * @param permission The permission to check.
 * @returns True if the user has the permission, false otherwise.
 */
export const hasPermission = (role: UserRole | undefined | null, permission: Permission): boolean => {
  if (!role) {
    return false;
  }

  // Admin has all permissions.
  if (role === 'admin') {
    return true;
  }

  switch (role) {
    case 'proprietor':
      switch (permission) {
        case 'viewDashboard':
        case 'manageDispatch':
        case 'manageReturns':
        case 'viewEmployees':
        case 'manageEmployees': // Proprietor can view and manage employees
        case 'viewProfile':
        case 'manageSettings':
          return true;
        default:
          return false;
      }

    case 'manager':
      switch (permission) {
        case 'viewDashboard':
        case 'manageDispatch':
        case 'manageReturns':
        case 'viewEmployees': // Manager can only view employees
        case 'viewProfile':
        case 'manageSettings':
          return true;
        case 'manageEmployees': // Manager cannot manage employees
          return false;
        default:
          return false;
      }
    default:
      // Unknown role or role with no explicit permissions defined here.
      return false;
  }
};
