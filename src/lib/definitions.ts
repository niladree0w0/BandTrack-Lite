
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
  dnrCapacity: DnrCapacity;
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
