import type { StageId } from '@/types/manufacturing';

export type UserRole = StageId | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** Primary role — 'ADMIN' or first assigned stage role */
  role: UserRole;
  /** All assigned roles — used for combined nav and permission checks */
  roles: UserRole[];
  stageName: string;
  avatar?: string;
}

export interface MockCredential {
  name: string;
  email: string;
  password: string;
  stage: UserRole;
  stageName: string;
}
