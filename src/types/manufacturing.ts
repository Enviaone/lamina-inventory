export type StageId =
  | 'MELTING'
  | 'SHOT_BLAST'
  | 'PROOF_MACHINES'
  | 'CNC'
  | 'HARDNESS_INSPECTION'
  | 'BALANCING'
  | 'PACKAGING';

export interface Brand {
  id: string;
  name: string;
}

export interface ManufacturingItem {
  id: string;
  brandId: string;
  name: string;
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
  { id: 'PROOF_MACHINES', label: 'Proof Machines', order: 3 },
  { id: 'CNC', label: 'CNC', order: 4 },
  { id: 'HARDNESS_INSPECTION', label: 'Inspection', order: 5 },
  { id: 'BALANCING', label: 'Balancing', order: 6 },
  { id: 'PACKAGING', label: 'Packaging', order: 7 },
];
