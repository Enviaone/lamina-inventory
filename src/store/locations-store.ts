import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Location {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
}

interface LocationsState {
  locations: Location[];
  add: (name: string) => void;
  update: (id: string, name: string) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

const INITIAL_LOCATIONS: Location[] = [
  { id: '1', name: 'Main Warehouse',          isDefault: true,  createdAt: new Date().toISOString() },
  { id: '2', name: 'Balancing Workshop',       isDefault: false, createdAt: new Date().toISOString() },
  { id: '3', name: 'CNC Workshop',             isDefault: false, createdAt: new Date().toISOString() },
  { id: '4', name: 'Proof Machine Workshop',   isDefault: false, createdAt: new Date().toISOString() },
  { id: '5', name: 'External — Chennai',        isDefault: false, createdAt: new Date().toISOString() },
  { id: '6', name: 'External — Coimbatore',    isDefault: false, createdAt: new Date().toISOString() },
];

export const useLocationsStore = create<LocationsState>()(
  persist(
    (set) => ({
      locations: INITIAL_LOCATIONS,

      add: (name) =>
        set((s) => ({
          locations: [
            ...s.locations,
            {
              id: crypto.randomUUID(),
              name: name.trim(),
              isDefault: s.locations.length === 0, // first item auto-defaults
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      update: (id, name) =>
        set((s) => ({
          locations: s.locations.map((l) =>
            l.id === id ? { ...l, name: name.trim() } : l,
          ),
        })),

      remove: (id) =>
        set((s) => {
          const removing = s.locations.find((l) => l.id === id);
          const remaining = s.locations.filter((l) => l.id !== id);
          // If removing the default, promote the first remaining to default
          if (removing?.isDefault && remaining.length > 0) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { locations: remaining };
        }),

      setDefault: (id) =>
        set((s) => ({
          locations: s.locations.map((l) => ({ ...l, isDefault: l.id === id })),
        })),
    }),
    { name: 'lamina-locations' },
  ),
);
