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
  { id: 'INSPECTION',       label: 'Inspection' },
  { id: 'OUTWARD_TRANSFER', label: 'Outward Transfer' },
  { id: 'PROOF_MACHINES',   label: 'Proof Machines' },
  { id: 'CNC',              label: 'CNC' },
  { id: 'BALANCING',        label: 'Balancing' },
  { id: 'INWARD_RETURN',    label: 'Inward Return' },
  { id: 'PACKAGING',        label: 'Packaging' },
];

export const STAGE_CONFIG: Record<StageId, StageConfig> = {
  MELTING: {
    stageId: 'MELTING',
    label: 'Melting',
    description: (b) => `Record production quantities for the melting stage — ${b}`,
    columns: [
      { key: 'productionQty', header: 'Production Qty', placeholder: 'Enter qty' },
    ],
  },
  SHOT_BLAST: {
    stageId: 'SHOT_BLAST',
    label: 'Shot Blast',
    description: (b) => `Enter input and production quantities for shot blast — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',      placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Production Qty', placeholder: 'Enter production qty' },
      { key: 'location',      header: 'Destination',    placeholder: 'Select destination' },
    ],
    validatePrevStage: true,
    locationDirection: 'destination',
  },
  INSPECTION: {
    stageId: 'INSPECTION',
    label: 'Inspection',
    description: (b) => `Enter input and rejection quantities for inspection — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',     placeholder: 'Enter input qty' },
      { key: 'rejectionQty',  header: 'Rejection Qty', placeholder: 'Enter rejection qty' },
    ],
    showApproved: true,
    validatePrevStage: true,
  },
  OUTWARD_TRANSFER: {
    stageId: 'OUTWARD_TRANSFER',
    label: 'Outward Transfer',
    description: (b) => `Select destination and enter dispatch quantities — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',      placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Output Qty', placeholder: 'Enter output qty' },
      { key: 'location',      header: 'Destination',    placeholder: 'Select destination' },
    ],
    locationDirection: 'destination',
  },
  PROOF_MACHINES: {
    stageId: 'PROOF_MACHINES',
    label: 'Proof Machines',
    description: (b) => `Enter input and output quantities for proof machines — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',  placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Output Qty', placeholder: 'Enter output qty' },
    ],
  },
  CNC: {
    stageId: 'CNC',
    label: 'CNC',
    description: (b) => `Enter input and output quantities for CNC processing — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',  placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Output Qty', placeholder: 'Enter output qty' },
    ],
  },
  HARDNESS_INSPECTION: {
    stageId: 'HARDNESS_INSPECTION',
    label: 'Hardness Inspection',
    description: (b) => `Select source stage and enter rejection quantities for hardness testing — ${b}`,
    columns: [
      { key: 'rejectionQty', header: 'Rejection Qty', placeholder: 'Enter rejection qty' },
    ],
    showStageSelector: true,
  },
  BALANCING: {
    stageId: 'BALANCING',
    label: 'Balancing',
    description: (b) => `Enter input and output quantities for balancing — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',  placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Output Qty', placeholder: 'Enter output qty' },
    ],
  },
  INWARD_RETURN: {
    stageId: 'INWARD_RETURN',
    label: 'Inward Return',
    description: (b) => `Select source location and enter received quantities — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',       placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Output Qty',      placeholder: 'Enter output qty' },
      { key: 'location',      header: 'Source Location', placeholder: 'Select source' },
    ],
    locationDirection: 'source',
  },
  PACKAGING: {
    stageId: 'PACKAGING',
    label: 'Packaging',
    description: (b) => `Enter source location, input and output quantities for packaging — ${b}`,
    columns: [
      { key: 'inputQty',      header: 'Input Qty',       placeholder: 'Enter input qty' },
      { key: 'productionQty', header: 'Output Qty',      placeholder: 'Enter output qty' },
      { key: 'location',      header: 'Source Location', placeholder: 'Select source' },
    ],
    locationDirection: 'source',
  },
};

export const SLUG_TO_STAGE_ID: Record<string, StageId> = {
  'melting':             'MELTING',
  'shot-blast':          'SHOT_BLAST',
  'inspection':          'INSPECTION',
  'outward-transfer':    'OUTWARD_TRANSFER',
  'proof-machines':      'PROOF_MACHINES',
  'cnc':                 'CNC',
  'hardness-inspection': 'HARDNESS_INSPECTION',
  'balancing':           'BALANCING',
  'inward-return':       'INWARD_RETURN',
  'packaging':           'PACKAGING',
};
