import type { StageId } from '@/types/manufacturing';

// Fields that can appear in a stage table row
export type QuantityField = 'inputQty' | 'productionQty' | 'rejectionQty' | 'location';

export interface StageColumnDef {
  key: QuantityField;
  header: string;
  placeholder: string;
  readonly?: boolean; // for auto-calculated fields
}

export interface StageConfig {
  stageId: StageId;
  label: string;
  description: (brandName: string) => string;
  columns: StageColumnDef[];
  /** Show approved qty (auto = inputQty - rejectionQty) */
  showApproved?: boolean;
  /** Warn if inputQty doesn't match previous stage productionQty */
  validatePrevStage?: boolean;
  /** Direction — 'destination' for outward, 'source' for inward */
  locationDirection?: 'destination' | 'source';
  /** Show a global "source stage" dropdown above the table */
  showStageSelector?: boolean;
}

export const TRANSFER_LOCATIONS = [
  'Balancing Workshop',
  'CNC Workshop',
  'Proof Machine Workshop',
  'External — Chennai',
  'External — Coimbatore',
  'Main Warehouse',
];

/** All stages available as source options for Hardness Inspection */
export const STAGE_OPTIONS: { id: string; label: string }[] = [
  { id: 'MELTING',          label: 'Melting' },
  { id: 'SHOT_BLAST',       label: 'Shot Blast' },
  { id: 'PROOF_MACHINES',   label: 'Proof Machines' },
  { id: 'CNC',              label: 'CNC' },
  { id: 'BALANCING',        label: 'Balancing' },
  { id: 'PACKAGING',        label: 'Packaging' },
];

export const STAGE_CONFIG: Record<StageId, StageConfig> = {
  MELTING: {
    stageId: 'MELTING',
    label: 'Melting',
    description: (b) => `Record production quantities for the melting stage — ${b}`,
    columns: [
      { key: 'inputQty', header: 'Intake Quantity', placeholder: 'Enter intake qty' },
    ],
  },
  SHOT_BLAST: {
    stageId: 'SHOT_BLAST',
    label: 'Shot Blast',
    description: (b) => `Enter input and production quantities for shot blast — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Intake Quantity',      placeholder: 'Enter intake qty' },
      { key: 'productionQty', header: 'Production Quantity', placeholder: 'Enter production qty' },
      { key: 'location',      header: 'Destination',    placeholder: 'Select destination' },
    ],
    validatePrevStage: true,
    locationDirection: 'destination',
  },

  PROOF_MACHINES: {
    stageId: 'PROOF_MACHINES',
    label: 'Proof Machines',
    description: (b) => `Enter input and output quantities for proof machines — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Intake Quantity',  placeholder: 'Enter intake qty' },
      { key: 'productionQty', header: 'Production Quantity', placeholder: 'Enter production qty' },
    ],
  },
  CNC: {
    stageId: 'CNC',
    label: 'CNC',
    description: (b) => `Enter input and output quantities for CNC processing — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Intake Quantity',  placeholder: 'Enter intake qty' },
      { key: 'productionQty', header: 'Production Quantity', placeholder: 'Enter production qty' },
    ],
  },
  HARDNESS_INSPECTION: {
    stageId: 'HARDNESS_INSPECTION',
    label: 'Inspection',
    description: (b) => `Select source stage and enter rejection quantities for hardness testing — ${b}`,
    columns: [
      { key: 'rejectionQty', header: 'Rejection Quantity', placeholder: 'Enter rejection qty' },
    ],
    showStageSelector: true,
  },
  BALANCING: {
    stageId: 'BALANCING',
    label: 'Balancing',
    description: (b) => `Enter input and output quantities for balancing — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Intake Quantity',  placeholder: 'Enter intake qty' },
      { key: 'productionQty', header: 'Production Quantity', placeholder: 'Enter production qty' },
    ],
  },

  PACKAGING: {
    stageId: 'PACKAGING',
    label: 'Packaging',
    description: (b) => `Enter source location, input and output quantities for packaging — ${b}`,
    columns: [
      { key: 'location',      header: 'Source Location', placeholder: 'Select source' },
      { key: 'inputQty',      header: 'Intake Quantity',       placeholder: 'Enter intake qty' },
      { key: 'productionQty', header: 'Production Quantity',      placeholder: 'Enter production qty' },
    ],
    locationDirection: 'source',
  },
};

export const SLUG_TO_STAGE_ID: Record<string, StageId> = {
  'melting':             'MELTING',
  'shot-blast':          'SHOT_BLAST',
  'proof-machines':      'PROOF_MACHINES',
  'cnc':                 'CNC',
  'hardness-inspection': 'HARDNESS_INSPECTION',
  'balancing':           'BALANCING',
  'packaging':           'PACKAGING',
};
