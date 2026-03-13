import { AppHeader } from '@/components/sidebar/app-header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PageTransition } from '@/components/shared/PageTransition';
import { CommandMenu } from '@/components/CommandMenu';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CommandMenu />
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4">
          <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-sidebar w-full">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
