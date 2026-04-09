import { useSearchParams, Link } from 'react-router';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import type { UserRole, UserStatus, UserFilters, User } from '@/types/user';
import { cn } from '@/lib/utils';

const ROLE_OPTIONS: { value: UserRole | ''; label: string }[] = [
  { value: '',            label: 'All roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin',       label: 'Admin' },
  { value: 'manager',     label: 'Manager' },
  { value: 'editor',      label: 'Editor' },
  { value: 'viewer',      label: 'Viewer' },
  { value: 'guest',       label: 'Guest' },
];

const STATUS_OPTIONS: { value: UserStatus | ''; label: string }[] = [
  { value: '',            label: 'All statuses' },
  { value: 'active',      label: 'Active' },
  { value: 'suspended',   label: 'Suspended' },
  { value: 'pending',     label: 'Pending' },
];

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  manager:     'Manager',
  editor:      'Editor',
  viewer:      'Viewer',
  guest:       'Guest',
};

const STATUS_STYLES: Record<UserStatus, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

type SortableColumn = NonNullable<UserFilters['sortBy']>;

const COLUMNS: { key: SortableColumn; label: string }[] = [
  { key: 'name',       label: 'Name' },
  { key: 'email',      label: 'Email' },
  { key: 'role',       label: 'Role' },
  { key: 'status',     label: 'Status' },
  { key: 'dateJoined', label: 'Joined' },
];

function SortIcon({ col, sortBy, sortDir }: { col: SortableColumn; sortBy: SortableColumn; sortDir: 'asc' | 'desc' }) {
  if (col !== sortBy) return <ChevronsUpDown size={13} className="text-gray-300 dark:text-gray-600" />;
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-indigo-500" />
    : <ChevronDown size={13} className="text-indigo-500" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function UserRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {[40, 56, 24, 20, 32].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse`} style={{ width: `${w * 2}px` }} />
        </td>
      ))}
    </tr>
  );
}

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchInput = searchParams.get('search') ?? '';
  const role        = (searchParams.get('role')    ?? '') as UserRole   | '';
  const status      = (searchParams.get('status')  ?? '') as UserStatus | '';
  const sortBy      = (searchParams.get('sortBy')  ?? 'name') as SortableColumn;
  const sortDir     = (searchParams.get('sortDir') ?? 'asc') as 'asc' | 'desc';
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading } = useUsers({
    search: debouncedSearch,
    role,
    status,
    sortBy,
    sortDir,
    page: Number(searchParams.get('page') ?? 1),
    pageSize: 10,
  });

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    });
  }

  function handleSearch(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value); else next.delete('search');
      next.delete('page');
      return next;
    });
  }

  function handleFilter(key: 'role' | 'status', value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.delete('page');
      return next;
    });
  }

  function handleSort(col: SortableColumn) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (col === sortBy) {
        next.set('sortDir', sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        next.set('sortBy', col);
        next.set('sortDir', 'asc');
      }
      next.delete('page');
      return next;
    });
  }

  const users: User[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? 'Loading…' : `${data?.total ?? 0} users`}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <select
          value={role}
          onChange={(e) => handleFilter('role', e.target.value)}
          className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => handleFilter('status', e.target.value)}
          className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {COLUMNS.map(({ key, label }) => (
                  <th key={key} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleSort(key)}
                      className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {label}
                      <SortIcon col={key} sortBy={sortBy} sortDir={sortDir} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <UserRowSkeleton key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/users/${user.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{ROLE_LABELS[user.role]}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_STYLES[user.status])}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(user.dateJoined)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                  <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-gray-400 dark:text-gray-600">…</span>
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
