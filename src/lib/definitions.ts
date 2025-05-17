
export const dnrCapacities = ["300dnr", "600dnr", "both", "none"] as const;
export type DnrCapacity = typeof dnrCapacities[number];

// Base employee type for common fields
export type BaseEmployee = {
  id: string;
  name: string;
  workType: string;
  contact: string; // Represents a phone number
};

export type InHouseEmployee = BaseEmployee;

// Note: A subcontractor with "both" dnrCapacity selected in the form
// will be stored as two separate entries: one with dnrCapacity="300dnr" and one with dnrCapacity="600dnr".
// The dnrCapacity field here reflects the effective capacity for that specific record.
export type Subcontractor = BaseEmployee & {
  dnrCapacity: "300dnr" | "600dnr" | "none"; // "both" is a form-only option that splits into 2 records
};

export type MaterialDispatch = {
  id: string;
  subcontractorId: string;
  subcontractorName?: string; // Optional: for display convenience
  materialType: string;
  quantity: number;
  dispatchDate: string; // ISO date string
};

export type MaterialReturn = {
  id: string;
  subcontractorId: string;
  subcontractorName?: string; // Optional: for display convenience
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
  id: string;
  username: string;
  role: UserRole;
}
