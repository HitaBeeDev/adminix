import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, RefreshCw, FileText, Trash2, Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from '@/stores/toastStore';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportType   = 'Users' | 'Accounts' | 'Activity';
type ReportFormat = 'CSV' | 'JSON';
type ReportStatus = 'ready' | 'generating';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  dateRange: string;
  format: ReportFormat;
  generated: string;
  status: ReportStatus;
  rows: number;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const INITIAL_REPORTS: Report[] = [
  { id: 'r1', name: 'User Growth Summary',        type: 'Users',    dateRange: 'Jan 2026 – Apr 2026', format: 'CSV',  generated: '2026-04-08T09:15:00Z', status: 'ready', rows: 248  },
  { id: 'r2', name: 'Suspended Users Audit',       type: 'Users',    dateRange: 'Q1 2026',             format: 'CSV',  generated: '2026-04-07T14:30:00Z', status: 'ready', rows: 17   },
  { id: 'r3', name: 'Account Plan Distribution',   type: 'Accounts', dateRange: 'All time',            format: 'JSON', generated: '2026-04-06T11:00:00Z', status: 'ready', rows: 84   },
  { id: 'r4', name: 'Enterprise Account Activity', type: 'Accounts', dateRange: 'Mar 2026',            format: 'CSV',  generated: '2026-04-05T08:45:00Z', status: 'ready', rows: 312  },
  { id: 'r5', name: 'Login Audit Log',             type: 'Activity', dateRange: 'Last 30 days',        format: 'CSV',  generated: '2026-04-08T07:00:00Z', status: 'ready', rows: 1042 },
  { id: 'r6', name: 'Permission Change Activity',  type: 'Activity', dateRange: 'Q1 2026',             format: 'JSON', generated: '2026-04-03T16:20:00Z', status: 'ready', rows: 55   },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'Users',    label: 'User Summary' },
  { value: 'Accounts', label: 'Account Summary' },
  { value: 'Activity', label: 'Activity Log' },
];

const DATE_PRESETS = [
  { label: 'Last 7 days',  from: () => daysAgo(7),  to: () => today() },
  { label: 'Last 30 days', from: () => daysAgo(30), to: () => today() },
  { label: 'Last 90 days', from: () => daysAgo(90), to: () => today() },
  { label: 'Q1 2026',      from: () => '2026-01-01', to: () => '2026-03-31' },
  { label: 'Q2 2026',      from: () => '2026-04-01', to: () => '2026-06-30' },
  { label: 'All time',     from: () => '2020-01-01', to: () => today() },
];

const TYPE_STYLES: Record<ReportType, string> = {
  Users:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Accounts: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Activity: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const FORMAT_STYLES: Record<ReportFormat, string> = {
  CSV:  'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  JSON: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today() { return new Date().toISOString().slice(0, 10); }
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function csvCell(value: string | number | undefined) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function mockRowCount(values: Pick<FormValues, 'name' | 'type' | 'from' | 'to'>) {
  const seed = `${values.name}:${values.type}:${values.from}:${values.to}`
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (seed % 800) + 10;
}

function mockDownload(report: Report) {
  let content: string;
  let mime: string;
  let ext: string;

  if (report.format === 'JSON') {
    content = JSON.stringify({ report: report.name, type: report.type, dateRange: report.dateRange, rows: report.rows, generated: report.generated }, null, 2);
    mime = 'application/json';
    ext = 'json';
  } else {
    content = [
      ['Report', 'Type', 'Date Range', 'Generated', 'Rows'].join(','),
      [csvCell(report.name), csvCell(report.type), csvCell(report.dateRange), csvCell(report.generated), csvCell(report.rows)].join(','),
    ].join('\n');
    mime = 'text/csv';
    ext = 'csv';
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── Generate Report Modal ────────────────────────────────────────────────────

const schema = z.object({
  name:   z.string().min(3, 'Name must be at least 3 characters'),
  type:   z.enum(['Users', 'Accounts', 'Activity'], { message: 'Select a report type' }),
  from:   z.string().min(1, 'Select a start date'),
  to:     z.string().min(1, 'Select an end date'),
  format: z.enum(['CSV', 'JSON']),
}).refine((d) => d.from <= d.to, { message: 'End date must be after start date', path: ['to'] });

type FormValues = z.infer<typeof schema>;

const fieldClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const errorClass = 'mt-1 text-xs text-rose-500';

function GenerateReportModal({ open, onClose, onGenerate }: {
  open: boolean;
  onClose: () => void;
  onGenerate: (report: Report) => void;
}) {
  const { register, control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { format: 'CSV' },
  });

  const format = useWatch({ control, name: 'format' });

  function applyPreset(from: string, to: string) {
    setValue('from', from, { shouldValidate: true });
    setValue('to', to, { shouldValidate: true });
  }

  function handleClose() { reset(); onClose(); }

  async function onSubmit(values: FormValues) {
    await new Promise((r) => setTimeout(r, 1000));
    const typeLabel = REPORT_TYPE_OPTIONS.find((o) => o.value === values.type)?.label ?? values.type;
    const generated = new Date().toISOString();
    const newReport: Report = {
      id: `r-${generated.replace(/\D/g, '')}`,
      name: values.name,
      type: values.type,
      dateRange: `${values.from} – ${values.to}`,
      format: values.format,
      generated,
      status: 'ready',
      rows: mockRowCount(values),
    };
    onGenerate(newReport);
    toast.success(`"${typeLabel}" report generated.`);
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Generate Report" description="Configure a new report to export.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <div>
          <label className={labelClass}>Report name</label>
          <input {...register('name')} placeholder="e.g. Monthly User Summary"
            className={cn(fieldClass, errors.name && 'border-rose-400 dark:border-rose-600')} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Report type */}
        <div>
          <label className={labelClass}>Report type</label>
          <select {...register('type')}
            className={cn(fieldClass, 'appearance-none cursor-pointer', errors.type && 'border-rose-400 dark:border-rose-600')}>
            <option value="">Select a type…</option>
            {REPORT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.type && <p className={errorClass}>{errors.type.message}</p>}
        </div>

        {/* Date range presets */}
        <div>
          <label className={labelClass}>Date range</label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {DATE_PRESETS.map((p) => (
              <button key={p.label} type="button"
                onClick={() => applyPreset(p.from(), p.to())}
                className="px-2.5 py-1 text-xs rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
              <input type="date" {...register('from')}
                className={cn(fieldClass, errors.from && 'border-rose-400 dark:border-rose-600')} />
              {errors.from && <p className={errorClass}>{errors.from.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
              <input type="date" {...register('to')}
                className={cn(fieldClass, errors.to && 'border-rose-400 dark:border-rose-600')} />
              {errors.to && <p className={errorClass}>{errors.to.message}</p>}
            </div>
          </div>
        </div>

        {/* Format */}
        <div>
          <label className={labelClass}>Format</label>
          <div className="flex gap-3">
            {(['CSV', 'JSON'] as ReportFormat[]).map((f) => (
              <label key={f} className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors',
                format === f
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600',
              )}>
                <input type="radio" {...register('format')} value={f} className="sr-only" />
                {f}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <tr className="border-b border-gray-50 dark:border-gray-800">
      {[48, 28, 44, 32, 20].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: w * 2 }} />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="w-20 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [reports, setReports]         = useState<Report[]>(INITIAL_REPORTS);
  const [typeFilter, setTypeFilter]   = useState<ReportType | ''>('');
  const [generateOpen, setGenerateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [isLoading, setIsLoading]     = useState(true);

  // Simulate initial table fetch
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = typeFilter ? reports.filter((r) => r.type === typeFilter) : reports;

  function handleGenerate(report: Report) {
    setReports((prev) => [report, ...prev]);
  }

  function handleRegenerate(id: string) {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: 'generating' } : r));
    setTimeout(() => {
      setReports((prev) => prev.map((r) =>
        r.id === id ? { ...r, status: 'ready', generated: new Date().toISOString() } : r
      ));
    }, 1800);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="block h-4 w-28 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : `${filtered.length} of ${reports.length} reports`}
          </p>
        </div>
        <button onClick={() => setGenerateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
          <Plus size={15} /> Generate report
        </button>
      </div>

      <GenerateReportModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={handleGenerate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Report"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete report"
      />

      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['', 'Users', 'Accounts', 'Activity'] as (ReportType | '')[]).map((type) => (
          <button key={type} onClick={() => setTypeFilter(type)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg border transition-colors',
              typeFilter === type
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
            )}>
            {type === '' ? 'All' : type}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Name', 'Type', 'Date Range', 'Generated', 'Rows', 'Actions'].map((h) => (
                  <th key={h} className={cn('px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400', h === 'Actions' && 'text-right')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No reports found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {typeFilter ? 'Try selecting a different type' : 'Generate your first report to get started'}
                        </p>
                      </div>
                      {typeFilter ? (
                        <button onClick={() => setTypeFilter('')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                          Clear filter
                        </button>
                      ) : (
                        <button onClick={() => setGenerateOpen(true)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                          Generate report
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <FileText size={15} className="text-gray-300 dark:text-gray-600 shrink-0" />
                        <span className="font-medium text-gray-800 dark:text-gray-100">{report.name}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', TYPE_STYLES[report.type])}>
                        {report.type}
                      </span>
                    </td>

                    {/* Date range */}
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{report.dateRange}</td>

                    {/* Generated */}
                    <td className="px-4 py-3.5">
                      <p className="text-gray-700 dark:text-gray-300">{formatRelative(report.generated)}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(report.generated)}</p>
                    </td>

                    {/* Rows */}
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 tabular-nums">
                      {report.rows.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleRegenerate(report.id)} disabled={report.status === 'generating'}
                          title="Regenerate"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                          <RefreshCw size={14} className={report.status === 'generating' ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => mockDownload(report)} disabled={report.status === 'generating'}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border disabled:opacity-40 transition-colors',
                            FORMAT_STYLES[report.format],
                            'border-current/20 hover:opacity-80',
                          )}>
                          <Download size={12} />
                          {report.format}
                        </button>
                        <button onClick={() => setDeleteTarget(report)} disabled={report.status === 'generating'}
                          title="Delete report"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-40 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
