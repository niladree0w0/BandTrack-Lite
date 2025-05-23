
import type { InHouseEmployee, Subcontractor, MaterialDispatch, MaterialReturn } from "./definitions";

export const placeholderInHouseEmployees: InHouseEmployee[] = [
  { id: "emp101", name: "Bob The Builder", workType: "Cutting", contact: "555-0101" },
  { id: "emp102", name: "Diana Prince", workType: "Quality Check", contact: "555-0103" },
];

// Subcontractor IDs: 3xx for 300dnr, 6xx for 600dnr, Sxx for none.
export const placeholderSubcontractors: Subcontractor[] = [
  { id: "601", name: "Alice Wonderland", workType: "Sewing", contact: "555-0100", dnrCapacity: "600dnr" },
  { id: "301", name: "Charlie Chaplin", workType: "Embroidery", contact: "555-0102", dnrCapacity: "300dnr" },
  // Edward Scissorhands was "both", now split:
  { id: "302", name: "Edward Scissorhands", workType: "Pattern Making", contact: "555-0104", dnrCapacity: "300dnr" },
  { id: "602", name: "Edward Scissorhands", workType: "Pattern Making", contact: "555-0104", dnrCapacity: "600dnr" },
  { id: "S101", name: "Fiona Gallagher", workType: "Finishing", contact: "555-0105", dnrCapacity: "none" },
];

export const placeholderDispatches: MaterialDispatch[] = [
  { id: "disp1", subcontractorId: "601", subcontractorName: "Alice Wonderland", materialType: "Fabric A", quantity: 100, dispatchDate: new Date().toISOString() },
  { id: "disp2", subcontractorId: "301", subcontractorName: "Charlie Chaplin", materialType: "Threads", quantity: 50, dispatchDate: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
];

export const placeholderReturns: MaterialReturn[] = [
  { id: "ret1", subcontractorId: "601", subcontractorName: "Alice Wonderland", quantity: 95, qualityStatus: "Good", returnDate: new Date().toISOString() },
  { id: "ret2", subcontractorId: "302", subcontractorName: "Edward Scissorhands", quantity: 5, qualityStatus: "Damaged", returnDate: new Date(Date.now() - 86400000 * 2).toISOString() }, // Two days ago
];
