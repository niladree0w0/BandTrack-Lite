export type Employee = {
  id: string;
  name: string;
  type: "Subcontractor" | "In-House";
  workType: string;
  contact: string;
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

