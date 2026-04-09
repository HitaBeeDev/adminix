import { useSearchParams } from 'react-router';
import { Download } from 'lucide-react';
import { useActivity } from '@/hooks/useActivity';
import { useUsers } from '@/hooks/useUsers';
import { fetchActivity } from '@/api/activity';
import { cn } from '@/lib/utils';
import type { ActionType, ActivityEvent } from '@/types/activity';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_OPTIONS: { value: ActionType | ''; label: string }[] = [
  { value: '',                    label: 'All actions' },
  { value: 'user:created',        label: 'User created' },
  { value: 'user:updated',        label: 'User updated' },
  { value: 'user:deleted',        label: 'User deleted' },
  { value: 'user:suspended',      label: 'User suspended' },
  { value: 'user:reactivated',    label: 'User reactivated' },
  { value: 'user:password_reset', label: 'Password reset' },
  { value: 'user:role_changed',   label: 'Role changed' },
  { value: 'account:created',     label: 'Account created' },
  { value: 'account:updated',     label: 'Account updated' },
  { value: 'account:suspended',   label: 'Account suspended' },
  { value: 'account:deleted',     label: 'Account deleted' },
  { value: 'role:created',        label: 'Role created' },
  { value: 'role:updated',        label: 'Role updated' },
  { value: 'role:deleted',        label: 'Role deleted' },
  { value: 'auth:login',          label: 'Login' },
  { value: 'auth:logout',         label: 'Logout' },
  { value: 'settings:updated',    label: 'Settings updated' },
];

const ACTION_LABEL: Record<string, string> = Object.fromEntries(
  ACTION_OPTIONS.filter((o) => o.value).map((o) => [o.value, o.label])
);

const DOT_COLOR: Record<string, string> = {
  'user:deleted':     'bg-rose-500',
  'user:suspended':   'bg-amber-500',
  'account:deleted':  'bg-rose-500',
  'account:suspended':'bg-amber-500',
  'role:deleted':     'bg-rose-500',
  'auth:login':       'bg-emerald-500',
  'auth:logout':      'bg-gray-400',
};

function dotColor(action: ActionType) {
  return DOT_COLOR[action] ?? 'bg-indigo-500';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

async function exportCsv(filters: Parameters<typeof fetchActivity>[0]) {
  const all = await fetchActivity({ ...filters, page: 1, pageSize: 1000 });
  const rows = [
    ['Timestamp', 'Actor', 'Email', 'Action', 'Target', 'IP'].join(','),
    ...all.data.map((e) =>
      [
        e.timestamp,
        `"${e.actorName}"`,
        e.actorEmail,
        e.action,
        e.targetName ? `"${e.targetName}"` : '',
        e.ipAddress ?? '',
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `activity-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventRow({ event }: { event: ActivityEvent }) {
  return (
    <div className="flex gap-4 py-4 first:pt-0">
      {/* timeline line + dot */}
      <div className="flex flex-col items-center">
        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0 mt-1', dotColor(event.action))} />
        <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 mt-2" />
      </div>

      {/* content */}
      <div className="flex-1 min-w-0 pb-2">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <span className="font-medium">{event.actorName}</span>
          {' '}
          <span className="text-gray-500 dark:text-gray-400">{ACTION_LABEL[event.action] ?? event.action}</span>
          {event.targetName && (
            <> <span className="font-medium">{event.targetName}</span></>
          )}
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-gray-400 dark:text-gray-500">{event.actorEmail}</span>
          {event.ipAddress && (
            <span className="text-xs text-gray-300 dark:text-gray-600 font-mono">{event.ipAddress}</span>
          )}
        </div>
      </div>

      {/* timestamp */}
      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatRelative(event.timestamp)}</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{formatDate(event.timestamp)}</p>
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 mt-2" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-64 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-3 w-40 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
      <div className="shrink-0 space-y-1.5">
        <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const selectClass = 'py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer';

export default function ActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const userId     = searchParams.get('userId')     ?? '';
  const actionType = searchParams.get('actionType') ?? '';
  const dateFrom   = searchParams.get('dateFrom')   ?? '';
  const dateTo     = searchParams.get('dateTo')     ?? '';
  const page       = Number(searchParams.get('page') ?? 1);

  const { data, isLoading } = useActivity({ userId, actionType: actionType as ActionType | '', dateFrom, dateTo, page, pageSize: 20 });
  const { data: usersData } = useUsers({ pageSize: 100 });

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    });
  }

  function handleFilter(key: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.delete('page');
      return next;
    });
  }

  const events = data?.data ?? [];
  const hasFilters = !!(userId || actionType || dateFrom || dateTo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? 'Loading…' : `${data?.total ?? 0} events`}
          </p>
        </div>
        <button
          onClick={() => exportCsv({ userId, actionType: actionType as ActionType | '', dateFrom, dateTo })}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* User */}
        <select
          value={userId}
          onChange={(e) => handleFilter('userId', e.target.value)}
          className={selectClass}
        >
          <option value="">All users</option>
          {usersData?.data.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        {/* Action type */}
        <select
          value={actionType}
          onChange={(e) => handleFilter('actionType', e.target.value)}
          className={selectClass}
        >
          {ACTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Date from */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => handleFilter('dateFrom', e.target.value)}
            className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Date to */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => handleFilter('dateTo', e.target.value)}
            className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {hasFilters && (
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline self-center"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)
        ) : events.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">📋</div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No events found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {hasFilters ? 'Try adjusting your filters' : 'Activity will appear here as users take actions'}
            </p>
            {hasFilters && (
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {events.map((event) => <EventRow key={event.id} event={event} />)}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {(data.page - 1) * data.pageSize + 1}–{Math.min(data.page * data.pageSize, data.total)} of {data.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setParam('page', String(data.page - 1))}
              disabled={data.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - data.page) <= 1)
              .reduce<(number | '…')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === '…' ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setParam('page', String(item))}
                    className={cn(
                      'w-9 py-1.5 rounded-lg border transition-colors',
                      item === data.page
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
                    )}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => setParam('page', String(data.page + 1))}
              disabled={data.page >= data.totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
