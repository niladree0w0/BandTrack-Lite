
export const dnrCapacities = ["300dnr", "600dnr", "both", "none"] as const;
export type DnrCapacity = typeof dnrCapacities[number];

// Base employee type for common fields
export type BaseEmployee = {
  id: string; 
  name: string;
  workType: string; 
  contact: string; 
};

export type InHouseEmployee = BaseEmployee;

export type Subcontractor = BaseEmployee & {
  dnrCapacity: "300dnr" | "600dnr" | "none"; 
};

export type MaterialDispatch = {
  id: string;
  subcontractorId: string;
  subcontractorName?: string; 
  materialType: string;
  quantity: number;
  dispatchDate: string; // ISO date string
};

export type MaterialReturn = {
  id: string;
  subcontractorId: string;
  subcontractorName?: string; 
  quantity: number;
  qualityStatus: "Good" | "Damaged" | "Needs Rework";
  returnDate: string; // ISO date string
};

export type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
};

export const materialTypes = ["Fabric A", "Fabric B", "Threads", "Buttons", "Zippers"];
export const qualityStatuses = ["Good", "Damaged", "Needs Rework"] as const;

// User Authentication
export const userRoles = ["admin", "manager", "proprietor"] as const;
export type UserRole = typeof userRoles[number];

// Define more granular permissions as your app grows.
// This list should align with the strings you'll use in Firestore 'roles' collection.
export const permissionsList = [
  'viewDashboard',
  'manageDispatch', // Covers viewing and interacting with the dispatch page
  'manageReturns',  // Covers viewing and interacting with the returns page
  'viewEmployees',
  'manageEmployees', 
  'viewProfile',
  'manageSettings',
  'managePermissions', // For future admin UI to edit roles' permissions
  'fullAccess' // Special permission for Admin
] as const;
export type Permission = typeof permissionsList[number];


export interface User {
  id: string; // Firebase UID
  username: string; // Email or display name from Firebase
  role: UserRole; 
  permissions: Permission[]; // NEW: List of allowed permissions for this user based on their role
}
