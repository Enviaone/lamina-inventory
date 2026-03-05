export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to Lumina Inventory. Start managing your stock efficiently.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* We'll add stat cards here later */}
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Items
          </h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            Low Stock
          </h3>
          <p className="text-2xl font-bold text-destructive">12</p>
        </div>
      </div>
    </div>
  );
}
