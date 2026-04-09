import { useState } from 'react';
import { Download, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReportType = 'Users' | 'Accounts' | 'Activity' | 'Roles';
type ReportStatus = 'ready' | 'generating';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  dateRange: string;
  generated: string; // ISO
  status: ReportStatus;
  rows: number;
}

const INITIAL_REPORTS: Report[] = [
  { id: 'r1', name: 'User Growth Summary',       type: 'Users',    dateRange: 'Jan 2026 – Apr 2026', generated: '2026-04-08T09:15:00Z', status: 'ready',      rows: 248 },
  { id: 'r2', name: 'Suspended Users Audit',      type: 'Users',    dateRange: 'Q1 2026',              generated: '2026-04-07T14:30:00Z', status: 'ready',      rows: 17  },
  { id: 'r3', name: 'Account Plan Distribution',  type: 'Accounts', dateRange: 'All time',             generated: '2026-04-06T11:00:00Z', status: 'ready',      rows: 84  },
  { id: 'r4', name: 'Enterprise Account Activity',type: 'Accounts', dateRange: 'Mar 2026',             generated: '2026-04-05T08:45:00Z', status: 'ready',      rows: 312 },
  { id: 'r5', name: 'Login Audit Log',            type: 'Activity', dateRange: 'Last 30 days',         generated: '2026-04-08T07:00:00Z', status: 'ready',      rows: 1042},
  { id: 'r6', name: 'Role Permission Changes',    type: 'Activity', dateRange: 'Q1 2026',              generated: '2026-04-03T16:20:00Z', status: 'ready',      rows: 55  },
  { id: 'r7', name: 'Role Distribution Report',   type: 'Roles',    dateRange: 'All time',             generated: '2026-04-01T12:00:00Z', status: 'ready',      rows: 6   },
];

const TYPE_STYLES: Record<ReportType, string> = {
  Users:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Accounts: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Activity: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Roles:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mockDownload(report: Report) {
  const csv = [
    ['Report', 'Type', 'Date Range', 'Generated', 'Rows'].join(','),
    [`"${report.name}"`, report.type, `"${report.dateRange}"`, report.generated, report.rows].join(','),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [typeFilter, setTypeFilter] = useState<ReportType | ''>('');

  const filtered = typeFilter ? reports.filter((r) => r.type === typeFilter) : reports;

  function handleRegenerate(id: string) {
    setReports((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: 'generating' } : r)
    );
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'ready', generated: new Date().toISOString() } : r
        )
      );
    }, 1800);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} of {reports.length} reports
          </p>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          {(['', 'Users', 'Accounts', 'Activity', 'Roles'] as (ReportType | '')[]).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                typeFilter === type
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
              )}
            >
              {type === '' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Name', 'Type', 'Date Range', 'Generated', 'Rows', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400',
                      h === 'Actions' && 'text-right',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
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
                      <button
                        onClick={() => handleRegenerate(report.id)}
                        disabled={report.status === 'generating'}
                        title="Regenerate"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      >
                        <RefreshCw size={14} className={report.status === 'generating' ? 'animate-spin' : ''} />
                      </button>
                      <button
                        onClick={() => mockDownload(report)}
                        disabled={report.status === 'generating'}
                        title="Download CSV"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
