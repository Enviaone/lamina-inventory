import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/auth';

// ─── Model ───────────────────────────────────────────────────────────────────

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  /** Plain-text for mock purposes */
  password: string;
  /**
   * Rules:
   *  - 'ADMIN' role is exclusive — cannot coexist with any stage role.
   *  - All other roles (stage roles) can be combined freely.
   */
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
}

// ─── Seed from mock credentials ───────────────────────────────────────────────

const SEED_USERS: ManagedUser[] = [
  { id: 'admin',    name: 'Admin User',     email: 'admin@lamina.com',     phone: '+91 98400 00001', password: 'admin@123',    roles: ['ADMIN'],              isActive: true,  createdAt: new Date().toISOString() },
  { id: 'melting',  name: 'Rajan Mehta',    email: 'melting@lamina.com',   phone: '+91 98400 00002', password: 'melting@123',  roles: ['MELTING'],            isActive: true,  createdAt: new Date().toISOString() },
  { id: 'shotblast',name: 'Suresh Pillai',  email: 'shotblast@lamina.com', phone: '+91 98400 00003', password: 'shotblast@123',roles: ['SHOT_BLAST'],         isActive: true,  createdAt: new Date().toISOString() },
  { id: 'inspect',  name: 'Priya Nair',     email: 'inspection@lamina.com',phone: '+91 98400 00004', password: 'inspect@123',  roles: ['INSPECTION'],         isActive: true,  createdAt: new Date().toISOString() },
  { id: 'outward',  name: 'Arjun Sharma',   email: 'outward@lamina.com',   phone: '+91 98400 00005', password: 'outward@123',  roles: ['OUTWARD_TRANSFER'],   isActive: false, createdAt: new Date().toISOString() },
  { id: 'proof',    name: 'Kavitha Reddy',  email: 'proof@lamina.com',     phone: '+91 98400 00006', password: 'proof@123',    roles: ['PROOF_MACHINES'],     isActive: true,  createdAt: new Date().toISOString() },
  { id: 'cnc',      name: 'Dinesh Kumar',   email: 'cnc@lamina.com',       phone: '+91 98400 00007', password: 'cnc@123',      roles: ['CNC'],                isActive: true,  createdAt: new Date().toISOString() },
  { id: 'hardness', name: 'Meena Sundaram', email: 'hardness@lamina.com',  phone: '+91 98400 00008', password: 'hardness@123', roles: ['HARDNESS_INSPECTION'],isActive: false, createdAt: new Date().toISOString() },
  { id: 'balance',  name: 'Vijay Krishnan', email: 'balancing@lamina.com', phone: '+91 98400 00009', password: 'balance@123',  roles: ['BALANCING'],          isActive: true,  createdAt: new Date().toISOString() },
  { id: 'inward',   name: 'Lakshmi Patel',  email: 'inward@lamina.com',    phone: '+91 98400 00010', password: 'inward@123',   roles: ['INWARD_RETURN'],      isActive: true,  createdAt: new Date().toISOString() },
  { id: 'packing',  name: 'Ramesh Babu',    email: 'packing@lamina.com',   phone: '+91 98400 00011', password: 'pack@123',     roles: ['PACKAGING'],          isActive: true,  createdAt: new Date().toISOString() },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface UsersState {
  users: ManagedUser[];
  add: (user: Omit<ManagedUser, 'id' | 'createdAt'>) => void;
  update: (id: string, patch: Partial<Omit<ManagedUser, 'id' | 'createdAt'>>) => void;
  remove: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: SEED_USERS,

      add: (user) =>
        set((s) => ({
          users: [
            ...s.users,
            { ...user, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),

      update: (id, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),

      remove: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      toggleStatus: (id) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
        })),
    }),
    { name: 'lamina-users' },
  ),
);
