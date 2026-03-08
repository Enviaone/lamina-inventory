import { Activity, ShieldCheck, UsersRound, Workflow } from 'lucide-react';
import { KpiCard, KpiCardGroup } from '@/features/dashboard/components/KpiCard';

interface UserManagementStatsProps {
  totalUsers: number;
  adminCount: number;
  stageCount: number;
  activeCount: number;
}

export function UserManagementStats({
  totalUsers,
  adminCount,
  stageCount,
  activeCount,
}: UserManagementStatsProps) {
  return (
    <KpiCardGroup className="grid-cols-2 lg:grid-cols-4 mb-6">
      <KpiCard
        title="Total Users"
        value={totalUsers}
        subtitle="registered accounts"
        icon={UsersRound}
      />
      <KpiCard
        title="Administrators"
        value={adminCount}
        subtitle="full access"
        icon={ShieldCheck}
      />
      <KpiCard
        title="Stage Operators"
        value={stageCount}
        subtitle="limited access"
        icon={Workflow}
      />
      <KpiCard
        title="Active Users"
        value={activeCount}
        subtitle="currently enabled"
        icon={Activity}
      />
    </KpiCardGroup>
  );
}
