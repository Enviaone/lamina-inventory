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
  Factory,
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

// Parent nav item that groups all stages as a collapsible submenu (Admin only)
const stagesGroup: NavItem = {
  title: 'Manufacturing',
  url: '/stages',
  icon: Factory,
  children: ALL_STAGE_CHILDREN,
};

// Flat map for stage-role users (one stage per user)
const stageItemMap: Record<string, NavItem> = Object.fromEntries(
  ALL_STAGE_CHILDREN.map((child) => {
    const key = child.title
      .toUpperCase()
      .replace(/ /g, '_');
    return [key, { title: child.title, url: child.url, icon: child.icon }];
  })
);

// Override keys that don't match the enum exactly
stageItemMap['SHOT_BLAST']          = ALL_STAGE_CHILDREN.find((c) => c.url.includes('/stages/shot-blast'))!;
stageItemMap['PROOF_MACHINES']      = ALL_STAGE_CHILDREN.find((c) => c.url.includes('/stages/proof-machines'))!;
stageItemMap['HARDNESS_INSPECTION'] = ALL_STAGE_CHILDREN.find((c) => c.url.includes('/stages/hardness-inspection'))!;

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return getNavItemsForRoles([role]);
}

export function getNavItemsForRoles(roles: UserRole[]): NavItem[] {
  // Admin is exclusive — never mixed
  if (roles.includes('ADMIN')) {
    return [dashboard, brands, stagesGroup, locations, reports, users, logs];
  }

  // Collect all stage nav items for each role, deduped by url
  const seen = new Set<string>();
  const stageItems: NavItem[] = [];
  for (const role of roles) {
    const item = stageItemMap[role];
    if (item && !seen.has(item.url)) {
      seen.add(item.url);
      stageItems.push(item);
    }
  }

  return [dashboard, ...stageItems, logs];
}
