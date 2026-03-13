import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import {
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Package2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  STAGE_CONFIG,
  SLUG_TO_STAGE_ID,
  STAGE_OPTIONS,
} from '@/features/stages/config/stage-config';
import { StageTable } from '@/features/stages/components/StageTable';
import { ReviewDialog } from '@/features/stages/components/ReviewDialog';
import { MOCK_BRANDS } from '@/types/brand';
import {
  type FlatStageRow,
  type StageRowState,
  emptyRowState,
} from '@/features/stages/types';
import { BRAND_COLOR_MAP } from '@/features/brands/constants/colorMap';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useStageSubmissionsStore,
  buildSubmissionRecords,
} from '@/store/stage-submissions-store';
import { useLocationsStore } from '@/store/locations-store';
import { useLogStore, buildLogEntries } from '@/store/log-store';
import { useAuthStore } from '@/store/auth-store';

// Flatten brands → items into table rows
function buildRows(brandId: string): FlatStageRow[] {
  const brand = MOCK_BRANDS.find((b) => b.id === brandId);
  if (!brand) return [];
  return brand.items.map((item) => ({
    brandId: brand.id,
    brandName: brand.name,
    itemId: item.id,
    itemName: item.name,
  }));
}

export default function StagePage() {
  const { stageSlug } = useParams<{ stageSlug: string }>();
  const navigate = useNavigate();
  const { submit, getPrevStageOutput } = useStageSubmissionsStore();
  const appendLogs = useLogStore((s) => s.append);
  const currentUser = useAuthStore((s) => s.user);

  const stageId = stageSlug ? SLUG_TO_STAGE_ID[stageSlug] : undefined;
  const config = stageId ? STAGE_CONFIG[stageId] : undefined;

  // Default location name — pre-seeded into location fields for stages that have one
  const defaultLocationName = useLocationsStore(
    (s) => s.locations.find((l) => l.isDefault)?.name ?? '',
  );
  const hasLocationColumn =
    config?.columns.some((c) => c.key === 'location') ?? false;

  const [selectedBrandId, setSelectedBrandId] = useState(MOCK_BRANDS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** For Hardness Inspection: which stage these items came from */
  const [selectedStageId, setSelectedStageId] = useState('');
  /** Shift selection — S1 / S2 / S3 / S4 */
  const [selectedShift, setSelectedShift] = useState('S1');

  const today = format(new Date(), 'MMMM do, yyyy');

  const selectedBrand =
    MOCK_BRANDS.find((b) => b.id === selectedBrandId) ?? MOCK_BRANDS[0];

  const colors = BRAND_COLOR_MAP.blue;
  const rows = buildRows(selectedBrandId);

  // ── Lifted row state ───────────────────────────────────────────────────────
  const [prevStageId, setPrevStageId] = useState<string | undefined>(stageId);
  const [prevBrandId, setPrevBrandId] = useState<string>(selectedBrandId);

  const [rowState, setRowState] = useState<Record<string, StageRowState>>(
    () => {
      const initialRows = buildRows(selectedBrandId);
      return Object.fromEntries(
        initialRows.map((r) => [
          r.itemId,
          emptyRowState(hasLocationColumn ? defaultLocationName : ''),
        ]),
      );
    },
  );

  // Reset row state when brand or stage changes
  if (selectedBrandId !== prevBrandId || stageId !== prevStageId) {
    setPrevBrandId(selectedBrandId);
    setPrevStageId(stageId);
    const newRows = buildRows(selectedBrandId);
    setRowState(
      Object.fromEntries(
        newRows.map((r) => [
          r.itemId,
          emptyRowState(hasLocationColumn ? defaultLocationName : ''),
        ]),
      ),
    );
  }

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    setSearchQuery('');
  };

  const handleUpdateField = (
    itemId: string,
    field: keyof StageRowState,
    value: string,
  ) => {
    setRowState((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] ?? emptyRowState()), [field]: value },
    }));
  };

  // ── Previous stage output for mismatch validation ──────────────────────────
  const prevStageOutput: Record<string, number> = {};
  if (stageId && config?.validatePrevStage) {
    rows.forEach((row) => {
      prevStageOutput[row.itemId] = getPrevStageOutput(stageId, row.itemId);
    });
  }

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleConfirmSubmit = async () => {
    if (!stageId) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate API

    const effectiveRows = rows;

    const records = buildSubmissionRecords(stageId, effectiveRows, rowState);
    submit(records);

    // Append to log store — captures shift + user for the Logs page
    const logEntries = buildLogEntries(
      stageId,
      effectiveRows,
      rowState,
      selectedShift,
      currentUser?.id ?? 'unknown',
      currentUser?.name ?? 'Unknown User',
    );
    appendLogs(logEntries);

    setIsSubmitting(false);
    setReviewOpen(false);

    // Reset filled data after submission
    setRowState(
      Object.fromEntries(rows.map((r) => [r.itemId, emptyRowState()])),
    );

    toast.success(
      `${config?.label} entries recorded for ${selectedBrand.name} — ${records.length} item${records.length !== 1 ? 's' : ''} saved.`,
    );
  };

  if (!config) {
    return (
      <RootLayout>
        <div className="flex flex-col items-center justify-center min-h-64 text-center gap-3">
          <Package2 className="w-10 h-10 text-muted-foreground" />
          <p className="font-medium text-foreground">Stage not found</p>
          <p className="text-sm text-muted-foreground">
            The stage{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {stageSlug}
            </code>{' '}
            does not exist.
          </p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      {/* ── Page Header ── */}
      <PageHeader
        title={config.label}
        description={config.description(selectedBrand.name)}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 shrink-0">
              <div
                className={`w-5 h-5 rounded-md ${colors.iconBg} flex items-center justify-center`}
              >
                <Package2 className={`w-3 h-3 ${colors.iconText}`} />
              </div>
              Change Brand
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {MOCK_BRANDS.map((brand) => (
              <DropdownMenuItem
                key={brand.id}
                className="gap-2 cursor-pointer"
                onClick={() => handleBrandChange(brand.id)}
              >
                <div
                  className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center"
                >
                  <Package2
                    className="w-3 h-3 text-blue-600"
                  />
                </div>
                <span className="flex-1 truncate">{brand.name}</span>
                {brand.id === selectedBrandId && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    Active
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      {/* ── Brand context card (with optional stage selector) ── */}
      <div
        className={`flex items-center justify-between gap-4 rounded-2xl border bg-linear-to-br ${colors.headerBg} p-4 mb-4 flex-wrap`}
      >
        {/* Icon + name */}
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0`}
          >
            <Package2 className={`w-5 h-5 ${colors.iconText}`} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm leading-tight">
              {selectedBrand.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {rows.length} item{rows.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stage selector — only for Hardness Inspection */}
        {config.showStageSelector && (
          <>
            <div className="h-8 w-px bg-border/60 shrink-0 mx-1" />
            <div className="flex items-center gap-3 min-w-0 flex-wrap">
              <Select
                value={selectedStageId}
                onValueChange={setSelectedStageId}
              >
                <SelectTrigger className="w-48 h-8 text-xs shrink-0">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_OPTIONS.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {/* ── Table card (toolbar header + table) ── */}
      <div className="rounded-2xl border border-border bg-card">
        {/* Toolbar row */}
        <div className="sticky top-0 z-20 bg-card flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-border rounded-t-2xl shadow-sm sm:shadow-none">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground w-full"
            />
          </div>

          <div className="hidden sm:block h-5 w-px bg-border shrink-0" />
          <div className="sm:hidden h-px w-full bg-border shrink-0" />

          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto px-2 sm:px-0">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
              <CalendarDays className="w-4 h-4" />
              <span>{today}</span>
            </div>

            {/* Shift */}
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-24 h-9 text-sm shadow-none bg-transparent focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['S1', 'S2', 'S3', 'S4'].map((s) => (
                  <SelectItem key={s} value={s} className="text-sm">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden sm:block h-5 w-px bg-border shrink-0" />

            <Button
              size="sm"
              className="gap-2 shrink-0 h-9 hidden sm:flex"
              onClick={() => setReviewOpen(true)}
            >
              <ClipboardCheck className="w-4 h-4" />
              Review &amp; Record
            </Button>
          </div>

          <Button
            size="sm"
            className="gap-2 w-full sm:hidden h-9 mt-1"
            onClick={() => setReviewOpen(true)}
          >
            <ClipboardCheck className="w-4 h-4" />
            Review &amp; Record
          </Button>
        </div>

        {/* Table (no outer border/card — already inside the card) */}
        <StageTable
          config={config}
          rows={rows}
          searchQuery={searchQuery}
          rowState={rowState}
          onUpdateField={handleUpdateField}
          prevStageOutput={prevStageOutput}
        />
      </div>

      {/* ── Review & Record Dialog ── */}
      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        config={config}
        brandName={selectedBrand.name}
        rows={rows}
        rowState={rowState}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </RootLayout>
  );
}
