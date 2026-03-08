import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, UserRole } from '@/types/auth';
import { useUsersStore } from '@/store/users-store';
import { STAGES } from '@/types/manufacturing';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  quickLogin: (role: UserRole) => void;
  logout: () => void;
}

function buildAuthUser(managedUser: {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}): AuthUser {
  const primaryRole = managedUser.roles[0] ?? 'ADMIN';
  const stageLabel =
    primaryRole === 'ADMIN'
      ? 'Administrator'
      : (STAGES.find((s) => s.id === primaryRole)?.label ?? primaryRole);

  return {
    id: managedUser.id,
    name: managedUser.name,
    email: managedUser.email,
    role: primaryRole,
    roles: managedUser.roles,
    stageName: stageLabel,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const users = useUsersStore.getState().users;
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (!found) {
          return { success: false, error: 'Invalid email or password.' };
        }
        set({ user: buildAuthUser(found), isAuthenticated: true });
        return { success: true };
      },

      quickLogin: (role) => {
        const users = useUsersStore.getState().users;
        // Find first user whose primary role matches
        const found = users.find((u) => u.roles[0] === role);
        if (!found) return;
        set({ user: buildAuthUser(found), isAuthenticated: true });
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'lamina-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
