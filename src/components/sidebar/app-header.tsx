import { Link, useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MOCK_BRANDS } from '@/types/brand';
import { SLUG_TO_STAGE_ID } from '@/features/stages/config/stage-config';
import { STAGE_CONFIG } from '@/features/stages/config/stage-config';
import { Fragment } from 'react';

interface Crumb {
  label: string;
  href?: string; // undefined = current page (not clickable)
}

function useBreadcrumbs(): Crumb[] {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'dashboard') {
    return [{ label: 'Dashboard' }];
  }

  const crumbs: Crumb[] = [];

  // /brands
  if (segments[0] === 'brands') {
    crumbs.push({
      label: 'Brands',
      href: segments.length > 1 ? '/brands' : undefined,
    });

    // /brands/:brandId
    if (segments[1]) {
      const brand = MOCK_BRANDS.find((b) => b.id === segments[1]);
      crumbs.push({ label: brand?.name ?? segments[1] });
    }

    return crumbs;
  }

  // /stages/:stageSlug
  if (segments[0] === 'stages' && segments[1]) {
    const stageId = SLUG_TO_STAGE_ID[segments[1]];
    const stageLabel = stageId ? STAGE_CONFIG[stageId]?.label : segments[1];
    crumbs.push({ label: 'Manufacturing', href: undefined });
    crumbs.push({ label: stageLabel ?? segments[1] });
    return crumbs;
  }

  // generic fallback — capitalise each segment
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href:
      i < segments.length - 1
        ? '/' + segments.slice(0, i + 1).join('/')
        : undefined,
  }));
}

export function AppHeader() {
  const crumbs = useBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <Fragment key={idx}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.href ?? '#'}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
