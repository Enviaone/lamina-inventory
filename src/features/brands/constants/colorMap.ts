export type BrandColorKey = 'blue' | 'rose' | 'amber' | 'violet' | 'green' | 'orange';

export interface BrandColorTokens {
  headerBg: string;
  iconBg: string;
  iconText: string;
  stockText: string;
  progressBar: string;
  ring: string;
  accent: string;
}

export const BRAND_COLOR_MAP: Record<BrandColorKey, BrandColorTokens> = {
  blue: {
    headerBg:    'from-blue-50 to-blue-100/40',
    iconBg:      'bg-blue-100',
    iconText:    'text-blue-600',
    stockText:   'text-blue-600',
    progressBar: 'bg-blue-500',
    ring:        'hover:ring-blue-200',
    accent:      'bg-blue-500',
  },
  rose: {
    headerBg:    'from-rose-50 to-rose-100/40',
    iconBg:      'bg-rose-100',
    iconText:    'text-rose-600',
    stockText:   'text-rose-600',
    progressBar: 'bg-rose-500',
    ring:        'hover:ring-rose-200',
    accent:      'bg-rose-500',
  },
  amber: {
    headerBg:    'from-amber-50 to-amber-100/40',
    iconBg:      'bg-amber-100',
    iconText:    'text-amber-600',
    stockText:   'text-amber-600',
    progressBar: 'bg-amber-500',
    ring:        'hover:ring-amber-200',
    accent:      'bg-amber-500',
  },
  violet: {
    headerBg:    'from-violet-50 to-violet-100/40',
    iconBg:      'bg-violet-100',
    iconText:    'text-violet-600',
    stockText:   'text-violet-600',
    progressBar: 'bg-violet-500',
    ring:        'hover:ring-violet-200',
    accent:      'bg-violet-500',
  },
  green: {
    headerBg:    'from-green-50 to-green-100/40',
    iconBg:      'bg-green-100',
    iconText:    'text-green-600',
    stockText:   'text-green-600',
    progressBar: 'bg-green-500',
    ring:        'hover:ring-green-200',
    accent:      'bg-green-500',
  },
  orange: {
    headerBg:    'from-orange-50 to-orange-100/40',
    iconBg:      'bg-orange-100',
    iconText:    'text-orange-600',
    stockText:   'text-orange-600',
    progressBar: 'bg-orange-500',
    ring:        'hover:ring-orange-200',
    accent:      'bg-orange-500',
  },
};
