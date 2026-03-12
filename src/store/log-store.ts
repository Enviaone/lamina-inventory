import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StageId } from '@/types/manufacturing';
import type { StageRowState } from '@/features/stages/types';

// ─── Log Entry ───────────────────────────────────────────────────────────────

export interface LogEntry {
  /** Unique id for this log row */
  id: string;
  stageId: StageId;
  stageLabel: string;
  brandId: string;
  brandName: string;
  itemId: string;
  itemName: string;
  shift: string;          // S1 / S2 / S3 / S4
  userId: string;
  userName: string;
  data: StageRowState;
  submittedAt: string;    // ISO timestamp
  editedAt?: string;      // set when admin edits
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface LogStore {
  logs: LogEntry[];
  append: (entries: LogEntry[]) => void;
  updateEntry: (id: string, patch: Partial<Pick<LogEntry, 'data' | 'shift'>>) => void;
  deleteEntry: (id: string) => void;
  clear: () => void;
}

export const useLogStore = create<LogStore>()(
  persist(
    (set) => ({
      logs: [],

      append: (entries) =>
        set((s) => ({ logs: [...s.logs, ...entries] })),

      updateEntry: (id, patch) =>
        set((s) => ({
          logs: s.logs.map((l) =>
            l.id === id ? { ...l, ...patch, editedAt: new Date().toISOString() } : l,
          ),
        })),

      deleteEntry: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      clear: () => set({ logs: [] }),
    }),
    { name: 'lamina-logs' },
  ),
);

// ─── Helper — build LogEntry[] from a submission batch ────────────────────────

import type { FlatStageRow } from '@/features/stages/types';
import { STAGE_CONFIG } from '@/features/stages/config/stage-config';

export function buildLogEntries(
  stageId: StageId,
  rows: FlatStageRow[],
  rowState: Record<string, StageRowState>,
  shift: string,
  userId: string,
  userName: string,
): LogEntry[] {
  const stageLabel = STAGE_CONFIG[stageId]?.label ?? stageId;
  const now = new Date().toISOString();

  return rows
    .filter((row) => {
      const s = rowState[row.itemId];
      return s && (s.inputQty || s.productionQty || s.rejectionQty);
    })
    .map((row) => ({
      id: crypto.randomUUID(),
      stageId,
      stageLabel,
      brandId: row.brandId,
      brandName: row.brandName,
      itemId: row.itemId,
      itemName: row.itemName,
      shift,
      userId,
      userName,
      data: rowState[row.itemId],
      submittedAt: now,
    }));
}
