
export const dnrCapacities = ["300dnr", "600dnr", "both", "none"] as const;
export type DnrCapacity = typeof dnrCapacities[number];

// Base employee type for common fields
export type BaseEmployee = {
  id: string; // For in-house, this can be custom. For subcontractors, this might align with a DB ID.
  name: string;
  workType: string; // Specialization or type of work
  contact: string; // Represents a phone number
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

export interface User {
  id: string; // Will be Firebase UID
  username: string; // Could be email or display name from Firebase
  role: UserRole; // This will need to be managed outside Firebase Auth (e.g., Firestore)
}
