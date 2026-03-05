import { Link, Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Lumina Inventory
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link
              to="/inventory"
              className="text-sm font-medium hover:text-primary"
            >
              Inventory
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
