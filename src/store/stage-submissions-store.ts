import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StageId } from '@/types/manufacturing';
import { STAGES } from '@/types/manufacturing';
import type { FlatStageRow, StageRowState } from '@/features/stages/types';

export interface SubmissionRecord {
  stageId: StageId;
  brandId: string;
  brandName: string;
  itemId: string;
  itemName: string;
  sku: string;
  data: StageRowState;
  submittedAt: string;
}

interface StageSubmissionsStore {
  submissions: SubmissionRecord[];
  /** Save a batch of records for a stage+brand */
  submit: (records: SubmissionRecord[]) => void;
  /**
   * Get the production output qty from the *previous* stage for a given item.
   * Used to validate input qty mismatches at Shot Blast and Inspection.
   */
  getPrevStageOutput: (currentStageId: StageId, itemId: string) => number;
  clear: () => void;
}

function getPrevStageId(currentStageId: StageId): StageId | null {
  const ordered = [...STAGES].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((s) => s.id === currentStageId);
  return idx > 0 ? ordered[idx - 1].id : null;
}

export const useStageSubmissionsStore = create<StageSubmissionsStore>()(
  persist(
    (set, get) => ({
      submissions: [],

      submit: (records) => {
        set((state) => {
          // Replace any existing record for the same stage+item, then append new ones
          const untouched = state.submissions.filter(
            (s) =>
              !records.some((r) => r.stageId === s.stageId && r.itemId === s.itemId),
          );
          return { submissions: [...untouched, ...records] };
        });
      },

      getPrevStageOutput: (currentStageId, itemId) => {
        const prevId = getPrevStageId(currentStageId);
        if (!prevId) return 0;
        const rec = get().submissions.find(
          (s) => s.stageId === prevId && s.itemId === itemId,
        );
        return parseFloat(rec?.data.productionQty ?? '0') || 0;
      },

      clear: () => set({ submissions: [] }),
    }),
    { name: 'lamina-stage-submissions' },
  ),
);

/** Build SubmissionRecord[] from a rowState map — used before calling submit() */
export function buildSubmissionRecords(
  stageId: StageId,
  rows: FlatStageRow[],
  rowState: Record<string, StageRowState>,
): SubmissionRecord[] {
  return rows
    .filter((row) => {
      const s = rowState[row.itemId];
      return s && (s.inputQty || s.productionQty || s.rejectionQty || s.location);
    })
    .map((row) => ({
      stageId,
      brandId: row.brandId,
      brandName: row.brandName,
      itemId: row.itemId,
      itemName: row.itemName,
      sku: row.sku,
      data: rowState[row.itemId],
      submittedAt: new Date().toISOString(),
    }));
}
