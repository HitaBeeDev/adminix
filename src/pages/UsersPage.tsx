import { useRef, useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Eye, Pencil, Ban, RefreshCw, Trash2, X } from 'lucide-react';
import { useUsers, useUpdateUserInline, useDeleteUser } from '@/hooks/useUsers';
import InviteUserModal from '@/components/features/InviteUserModal';
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
      <td className="pl-4 pr-2 py-3"><div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" /></td>
      {[40, 56, 24, 20, 32].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: `${w * 2}px` }} />
        </td>
      ))}
      <td className="px-4 py-3"><div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" /></td>
    </tr>
  );
}

interface RowActionMenuProps {
  user: User;
  onUpdate: (payload: { id: string; payload: { status: User['status'] } }) => void;
  onDelete: (id: string) => void;
}

function RowActionMenu({ user, onUpdate, onDelete }: RowActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const isSuspended = user.status === 'suspended';

  function action(fn: () => void) {
    fn();
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="py-1">
            <button onClick={() => action(() => navigate(`/users/${user.id}`))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Eye size={14} className="text-gray-400" /> View
            </button>
            <button onClick={() => action(() => navigate(`/users/${user.id}`))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Pencil size={14} className="text-gray-400" /> Edit
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 py-1">
            <button
              onClick={() => action(() => onUpdate({ id: user.id, payload: { status: isSuspended ? 'active' : 'suspended' } }))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {isSuspended ? <RefreshCw size={14} /> : <Ban size={14} />}
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </button>
            <button
              onClick={() => action(() => onDelete(user.id))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
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

  const [inviteOpen, setInviteOpen] = useState(false);
  const updateUser = useUpdateUserInline();
  const deleteUser = useDeleteUser();

  async function handleBulkDelete() {
    await Promise.all([...selected].map((id) => deleteUser.mutateAsync(id)));
    setSelected(new Set());
  }

  async function handleBulkSuspend() {
    await Promise.all(
      [...selected].map((id) => updateUser.mutateAsync({ id, payload: { status: 'suspended' } }))
    );
    setSelected(new Set());
  }
  const users: User[] = data?.data ?? [];

  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Clear selection when page/filters change
  const pageKey = searchParams.toString();
  useEffect(() => { setSelected(new Set()); }, [pageKey]);

  const allOnPageSelected = users.length > 0 && users.every((u) => selected.has(u.id));
  const someOnPageSelected = users.some((u) => selected.has(u.id)) && !allOnPageSelected;

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        users.forEach((u) => next.delete(u.id));
      } else {
        users.forEach((u) => next.add(u.id));
      }
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="block h-4 w-20 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : (
              selected.size > 0
                ? `${selected.size} of ${data?.total ?? 0} selected`
                : `${data?.total ?? 0} users`
            )}
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          + Invite user
        </button>
      </div>

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />

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

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex-1">
            {selected.size} user{selected.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkSuspend}
            disabled={updateUser.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 transition-colors"
          >
            <Ban size={13} /> Suspend
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={deleteUser.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors"
            title="Clear selection"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="pl-4 pr-2 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    ref={(el) => { if (el) el.indeterminate = someOnPageSelected; }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
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
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <UserRowSkeleton key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Search size={20} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No users found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {debouncedSearch || role || status
                            ? 'Try adjusting your filters or search term'
                            : 'Invite your first user to get started'}
                        </p>
                      </div>
                      {(debouncedSearch || role || status) && (
                        <button
                          onClick={() => setSearchParams(new URLSearchParams())}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      'border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors',
                      selected.has(user.id)
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    )}
                  >
                    <td className="pl-4 pr-2 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(user.id)}
                        onChange={() => toggleOne(user.id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
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
                    <td className="px-4 py-3">
                      <RowActionMenu
                        user={user}
                        onUpdate={(args) => updateUser.mutate(args)}
                        onDelete={(id) => deleteUser.mutate(id)}
                      />
                    </td>
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
