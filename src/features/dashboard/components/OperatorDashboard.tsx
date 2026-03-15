import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowDownLeft,
  ClipboardCheck,
  PackageCheck,
  XCircle,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard, KpiCardGroup } from '@/features/dashboard/components/KpiCard';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import type { AuthUser } from '@/types/auth';
import type { StageId } from '@/types/manufacturing';
import {
  OPERATOR_STATS,
  PIPELINE_STATS,
} from '@/features/dashboard/data/mock-dashboard';
import { MyRecentSubmissions } from '@/features/dashboard/components/MyRecentSubmissions';
import { SLUG_TO_STAGE_ID } from '@/features/stages/config/stage-config';

// Reverse map: StageId → slug
const STAGE_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_STAGE_ID).map(([slug, id]) => [id, slug]),
);

interface OperatorDashboardProps {
  user: AuthUser;
}

export function OperatorDashboard({ user }: OperatorDashboardProps) {
  const navigate = useNavigate();
  const stageId = user.role as StageId;
  const stats = OPERATOR_STATS[stageId] ?? {
    input: 0,
    output: 0,
    rejections: 0,
  };
  const pipeline = PIPELINE_STATS.find((p) => p.stageId === stageId);
  const stageSlug = STAGE_TO_SLUG[stageId];
  const today = format(new Date(), 'EEEE, MMMM do');

  // Check if there are mismatches (mock: if previous stage output vs this input)
  const hasMismatch = pipeline?.status === 'partial' && stats.input === 0;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good{' '}
            {new Date().getHours() < 12
              ? 'morning'
              : new Date().getHours() < 17
                ? 'afternoon'
                : 'evening'}
            , {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {today} · {user.stageName} Stage
          </p>
        </div>

        {/* Quick action */}
        <Button
          size="lg"
          className="gap-2 shrink-0 h-11"
          onClick={() => navigate(`/stages/${stageSlug}`)}
        >
          <ClipboardCheck className="w-5 h-5" />
          Record Entry
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Mismatch alert banner */}
      {hasMismatch && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Input mismatch detected
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              The previous stage output doesn't match your expected input
              quantity. Please review before recording.
            </p>
          </div>
        </div>
      )}

      {/* Today's KPIs */}
      <KpiCardGroup className="grid-cols-1 sm:grid-cols-3">
        <KpiCard
          title="Today's Input"
          value={stats.input}
          subtitle="units received"
          icon={ArrowDownLeft}
        />
        <KpiCard
          title="Today's Output"
          value={stats.output}
          subtitle="units produced"
          icon={PackageCheck}
        />
        <KpiCard
          title="Rejections"
          value={stats.rejections}
          subtitle="units rejected today"
          icon={XCircle}
          trend={
            stats.rejections > 0
              ? { value: `${stats.rejections} units`, positive: false }
              : undefined
          }
        />
      </KpiCardGroup>

      {/* My submissions + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MyRecentSubmissions userId={user.id} />
        <RecentActivity />
      </div>
    </div>
  );
}
