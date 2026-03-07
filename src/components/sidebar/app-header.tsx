import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="font-medium">Dashboard</div>
      </div>
    </header>
  );
}
