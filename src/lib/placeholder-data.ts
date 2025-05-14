
import type { InHouseEmployee, Subcontractor, MaterialDispatch, MaterialReturn, DnrCapacity } from "./definitions";

export const placeholderInHouseEmployees: InHouseEmployee[] = [
  { id: "2", name: "Bob The Builder", workType: "Cutting", contact: "bob@example.com" },
  { id: "4", name: "Diana Prince", workType: "Quality Check", contact: "diana@example.com" },
];

export const placeholderSubcontractors: Subcontractor[] = [
  { id: "1", name: "Alice Wonderland", workType: "Sewing", contact: "alice@example.com", dnrCapacity: "600dnr" },
  { id: "3", name: "Charlie Chaplin", workType: "Embroidery", contact: "charlie@example.com", dnrCapacity: "300dnr" },
  { id: "5", name: "Edward Scissorhands", workType: "Pattern Making", contact: "edward@example.com", dnrCapacity: "both" },
];

export const placeholderDispatches: MaterialDispatch[] = [
  { id: "disp1", subcontractorId: "1", subcontractorName: "Alice Wonderland", materialType: "Fabric A", quantity: 100, dispatchDate: new Date().toISOString() },
  { id: "disp2", subcontractorId: "3", subcontractorName: "Charlie Chaplin", materialType: "Threads", quantity: 50, dispatchDate: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
];

export const placeholderReturns: MaterialReturn[] = [
  { id: "ret1", subcontractorId: "1", subcontractorName: "Alice Wonderland", quantity: 95, qualityStatus: "Good", returnDate: new Date().toISOString() },
  { id: "ret2", subcontractorId: "3", subcontractorName: "Charlie Chaplin", quantity: 5, qualityStatus: "Damaged", returnDate: new Date(Date.now() - 86400000 * 2).toISOString() }, // Two days ago
];
