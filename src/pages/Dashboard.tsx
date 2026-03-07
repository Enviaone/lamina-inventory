import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';

export default function Dashboard() {
  return (
    <RootLayout>
      <PageHeader title="Dashboard" description="Welcome to your dashboard" />
    </RootLayout>
  );
}
