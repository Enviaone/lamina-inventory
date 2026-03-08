import type { UserRole } from '@/types/auth';
import { STAGES } from '@/types/manufacturing';

export function roleLabel(role: UserRole): string {
  if (role === 'ADMIN') return 'Administrator';
  return STAGES.find((s) => s.id === role)?.label ?? role;
}
