import { format, isToday, isYesterday, parseISO } from 'date-fns';
import type { LogEntry } from '@/store/log-store';

export function dateGroupLabel(iso: string): string {
  const d = parseISO(iso);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, MMMM do');
}

export function groupByDate(
  logs: LogEntry[],
): { label: string; date: string; entries: LogEntry[] }[] {
  const map = new Map<string, LogEntry[]>();
  const sorted = [...logs].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
  for (const log of sorted) {
    const key = format(parseISO(log.submittedAt), 'yyyy-MM-dd');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(log);
  }
  return Array.from(map.entries()).map(([date, entries]) => ({
    label: dateGroupLabel(entries[0].submittedAt),
    date,
    entries,
  }));
}

export function primaryQty(entry: LogEntry): {
  value: string;
  label: string;
  sub?: string;
} {
  if (entry.data.productionQty) {
    return {
      value: entry.data.productionQty,
      label: 'Produced units',
      sub: entry.data.inputQty ? `(Input: ${entry.data.inputQty} units)` : undefined,
    };
  }
  if (entry.data.inputQty) {
    return { value: entry.data.inputQty, label: 'Units consumed' };
  }
  if (entry.data.rejectionQty) {
    return { value: entry.data.rejectionQty, label: 'Units rejected' };
  }
  return { value: '—', label: '' };
}
