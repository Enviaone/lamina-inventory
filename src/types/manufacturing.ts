export type StageId =
  | 'MELTING'
  | 'SHOT_BLAST'
  | 'INSPECTION'
  | 'OUTWARD_TRANSFER'
  | 'PROOF_MACHINES'
  | 'CNC'
  | 'HARDNESS_INSPECTION'
  | 'BALANCING'
  | 'INWARD_RETURN'
  | 'PACKAGING';

export interface Brand {
  id: string;
  name: string;
}

export interface ManufacturingItem {
  id: string;
  brandId: string;
  name: string;
  sku: string;
}

export interface ProcessLog {
  id: string;
  stageId: StageId;
  itemId: string;
  inputQuantity?: number;
  productionQuantity?: number;
  rejectionQuantity?: number;
  approvedQuantity?: number;
  location?: string;
  performedBy: string;
  timestamp: string;
}

export const STAGES: { id: StageId; label: string; order: number }[] = [
  { id: 'MELTING', label: 'Melting', order: 1 },
  { id: 'SHOT_BLAST', label: 'Shot Blast', order: 2 },
  { id: 'INSPECTION', label: 'Inspection', order: 3 },
  { id: 'OUTWARD_TRANSFER', label: 'Outward Transfer', order: 4 },
  { id: 'PROOF_MACHINES', label: 'Proof Machines', order: 5 },
  { id: 'CNC', label: 'CNC', order: 6 },
  { id: 'HARDNESS_INSPECTION', label: 'Hardness Inspection', order: 7 },
  { id: 'BALANCING', label: 'Balancing', order: 8 },
  { id: 'INWARD_RETURN', label: 'Inward Return', order: 9 },
  { id: 'PACKAGING', label: 'Packaging', order: 10 },
];
