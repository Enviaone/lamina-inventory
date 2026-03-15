import {
  LayoutDashboard,
  type LucideIcon,
  PackageIcon,
  Flame,
  Wind,
  Gauge,
  Cpu,
  Microscope,
  Scale,
  Archive,
  MapPin,
  ClipboardList,
  UsersRound,
  PieChart,
} from 'lucide-react';
import type { UserRole } from '@/types/auth';

export interface NavChild {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavChild[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Leaf routes ─────────────────────────────────────────────────────────────
const dashboard: NavItem = { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard };
const brands: NavItem    = { title: 'Brands',    url: '/brands',    icon: PackageIcon };
const locations: NavItem = { title: 'Locations',    url: '/locations', icon: MapPin };
const logs: NavItem      = { title: 'Logs',          url: '/logs',      icon: ClipboardList };
const reports: NavItem   = { title: 'Reports',       url: '/reports',   icon: PieChart };
const users: NavItem     = { title: 'User Management', url: '/users',   icon: UsersRound };

const ALL_STAGE_CHILDREN: NavChild[] = [
  { title: 'Melting',             url: '/stages/melting',             icon: Flame         },
  { title: 'Shot Blast',          url: '/stages/shot-blast',          icon: Wind          },
  // { title: 'Inspection',          url: '/stages/inspection',          icon: ScanSearch    },
  // { title: 'Outward Transfer',    url: '/stages/outward-transfer',    icon: ArrowUpRight  },
  { title: 'Proof Machines',      url: '/stages/proof-machines',      icon: Gauge         },
  { title: 'CNC',                 url: '/stages/cnc',                 icon: Cpu           },
  { title: 'Inspection', url: '/stages/hardness-inspection', icon: Microscope    },
  { title: 'Balancing',           url: '/stages/balancing',           icon: Scale         },
  // { title: 'Inward Return',       url: '/stages/inward-return',       icon: ArrowDownLeft },
  { title: 'Packaging',           url: '/stages/packaging',           icon: Archive       },
];

// Map StageId to the corresponding navigation item
const stageItemMap: Record<string, NavItem> = {
  MELTING: { title: 'Melting', url: '/stages/melting', icon: Flame },
  SHOT_BLAST: { title: 'Shot Blast', url: '/stages/shot-blast', icon: Wind },
  PROOF_MACHINES: { title: 'Proof Machines', url: '/stages/proof-machines', icon: Gauge },
  CNC: { title: 'CNC', url: '/stages/cnc', icon: Cpu },
  HARDNESS_INSPECTION: { title: 'Inspection', url: '/stages/hardness-inspection', icon: Microscope },
  BALANCING: { title: 'Balancing', url: '/stages/balancing', icon: Scale },
  PACKAGING: { title: 'Packaging', url: '/stages/packaging', icon: Archive },
};

export function getNavItemsForRole(role: UserRole): NavGroup[] {
  return getNavItemsForRoles([role]);
}

export function getNavItemsForRoles(roles: UserRole[]): NavGroup[] {
  const isAdmin = roles.includes('ADMIN');

  if (isAdmin) {
    return [
      {
        label: 'OVERVIEW',
        items: [
          { ...dashboard },
          { ...brands },
        ],
      },
      {
        label: 'STAGES',
        items: ALL_STAGE_CHILDREN.map((child) => ({
          title: child.title,
          url: child.url,
          icon: child.icon,
        })),
      },
      {
        label: 'ADMIN',
        items: [users, locations, reports, logs],
      },
    ];
  }

  // Stage-specific roles
  const stageItems: NavItem[] = [];
  const seen = new Set<string>();

  // Rule: If user has SHOT_BLAST role, exclude MELTING navigation
  const refinedRoles = roles.includes('SHOT_BLAST')
    ? roles.filter(r => r !== 'MELTING')
    : roles;

  for (const role of refinedRoles) {
    const item = stageItemMap[role];
    if (item && !seen.has(item.url)) {
      seen.add(item.url);
      stageItems.push(item);
    }
  }

  return [
    {
      label: 'OVERVIEW',
      items: [dashboard, logs],
    },
    {
      label: 'MY STAGES',
      items: stageItems,
    },
  ];
}
