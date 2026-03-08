import type { StageId } from '@/types/manufacturing';
import { MOCK_BRANDS } from '@/types/brand';

// ─── Today's stage pipeline data ─────────────────────────────────────────────
export interface StageStat {
  stageId: StageId;
  label: string;
  input: number;
  output: number;
  rejections: number;
  status: 'done' | 'partial' | 'pending';
}

export const PIPELINE_STATS: StageStat[] = [
  { stageId: 'MELTING',             label: 'Melting',             input: 0,     output: 8420,  rejections: 0,   status: 'done'    },
  { stageId: 'SHOT_BLAST',          label: 'Shot Blast',          input: 8420,  output: 8180,  rejections: 0,   status: 'done'    },
  { stageId: 'INSPECTION',          label: 'Inspection',          input: 8180,  output: 7650,  rejections: 530, status: 'done'    },
  { stageId: 'OUTWARD_TRANSFER',    label: 'Outward Transfer',    input: 7650,  output: 7200,  rejections: 0,   status: 'partial' },
  { stageId: 'PROOF_MACHINES',      label: 'Proof Machines',      input: 7200,  output: 5400,  rejections: 0,   status: 'partial' },
  { stageId: 'CNC',                 label: 'CNC',                 input: 0,     output: 0,     rejections: 0,   status: 'pending' },
  { stageId: 'HARDNESS_INSPECTION', label: 'Hardness Inspection', input: 0,     output: 0,     rejections: 0,   status: 'pending' },
  { stageId: 'BALANCING',           label: 'Balancing',           input: 0,     output: 0,     rejections: 0,   status: 'pending' },
  { stageId: 'INWARD_RETURN',       label: 'Inward Return',       input: 0,     output: 0,     rejections: 0,   status: 'pending' },
  { stageId: 'PACKAGING',           label: 'Packaging',           input: 0,     output: 0,     rejections: 0,   status: 'pending' },
];

// ─── Recent activity feed ─────────────────────────────────────────────────────
export interface ActivityEntry {
  id: string;
  stage: string;
  user: string;
  brand: string;
  item: string;
  qty: number;
  timeAgo: string;
  type: 'production' | 'rejection' | 'transfer';
}

export const RECENT_ACTIVITY: ActivityEntry[] = [
  { id: '1', stage: 'Inspection',      user: 'Priya Nair',    brand: 'Ashok Leyland', item: 'Flywheel Ring Gear',  qty: 530,  timeAgo: '8 min ago',  type: 'rejection'   },
  { id: '2', stage: 'Shot Blast',      user: 'Suresh Pillai', brand: 'Tata Motors',   item: 'Brake Drum',          qty: 1200, timeAgo: '22 min ago', type: 'production'  },
  { id: '3', stage: 'Outward Transfer',user: 'Arjun Sharma',  brand: 'Mahindra',      item: 'Camshaft Sprocket',   qty: 850,  timeAgo: '41 min ago', type: 'transfer'    },
  { id: '4', stage: 'Melting',         user: 'Rajan Mehta',   brand: 'Eicher Motors', item: 'Gear Shift Fork',     qty: 2100, timeAgo: '1 hr ago',   type: 'production'  },
  { id: '5', stage: 'Proof Machines',  user: 'Kavitha Reddy', brand: 'Tata Motors',   item: 'Clutch Housing',      qty: 980,  timeAgo: '1 hr ago',   type: 'production'  },
];

// ─── Derived KPIs from mock brands ───────────────────────────────────────────
const allItems = MOCK_BRANDS.flatMap((b) => b.items);
export const TOTAL_BRANDS  = MOCK_BRANDS.length;
export const TOTAL_ITEMS   = allItems.length;
export const TOTAL_STOCK   = allItems.reduce((s, i) => s + i.currentStock, 0);


export const TOTAL_UNITS_TODAY = PIPELINE_STATS.reduce((s, p) => s + p.output, 0);
export const TOTAL_REJECTIONS_TODAY = PIPELINE_STATS.reduce((s, p) => s + p.rejections, 0);

// ─── Pending brands (no entry submitted today — mock: brands not in pipeline) ─
export const PENDING_BRANDS = MOCK_BRANDS.slice(2); // mock: first 2 have entries

// ─── Stage operator daily stats (keyed by StageId) ───────────────────────────
export const OPERATOR_STATS: Partial<Record<StageId, { input: number; output: number; rejections: number }>> =
  Object.fromEntries(PIPELINE_STATS.map((s) => [s.stageId, { input: s.input, output: s.output, rejections: s.rejections }]));
