import { Archive, Cpu, Flame, Gauge, Microscope, Scale, Wind, type LucideIcon } from "lucide-react";

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

export const STAGES: { id: StageId; label: string; order: number; icon: LucideIcon}[] = [
  { id: 'MELTING', label: 'Melting', order: 1, icon: Flame},
  { id: 'SHOT_BLAST', label: 'Shot Blast', order: 2, icon: Wind },
  { id: 'PROOF_MACHINES', label: 'Proof Machines', order: 3, icon: Gauge },
  { id: 'CNC', label: 'CNC', order: 4, icon: Cpu},
  { id: 'HARDNESS_INSPECTION', label: 'Inspection', order: 5, icon: Microscope },
  { id: 'BALANCING', label: 'Balancing', order: 6, icon: Scale },
  { id: 'PACKAGING', label: 'Packaging', order: 7, icon: Archive },
];
