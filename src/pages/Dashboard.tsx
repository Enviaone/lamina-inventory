import { RootLayout } from '@/layouts/RootLayout';
import { useAuthStore } from '@/store/auth-store';
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard';
import { OperatorDashboard } from '@/features/dashboard/components/OperatorDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <RootLayout>
      {user?.role === 'ADMIN' ? (
        <AdminDashboard />
      ) : user ? (
        <OperatorDashboard user={user} />
      ) : null}
    </RootLayout>
  );
}
