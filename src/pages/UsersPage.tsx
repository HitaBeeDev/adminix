import { useRef, useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Eye, Pencil, Ban, RefreshCw, Trash2, X } from 'lucide-react';
import { useUsers, useUpdateUserInline, useDeleteUser } from '@/hooks/useUsers';
import InviteUserModal from '@/components/features/InviteUserModal';
import ErrorState from '@/components/ui/ErrorState';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/stores/toastStore';
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

const VIRTUAL_PAGE_SIZE = 100_000;
const USER_ROW_HEIGHT = 60;
const USER_GRID_COLUMNS = '44px minmax(220px, 1.25fr) minmax(260px, 1.4fr) 140px 130px 130px 64px';

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
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const searchInput = searchParams.get('search') ?? '';
  const role        = (searchParams.get('role')    ?? '') as UserRole   | '';
  const status      = (searchParams.get('status')  ?? '') as UserStatus | '';
  const sortBy      = (searchParams.get('sortBy')  ?? 'name') as SortableColumn;
  const sortDir     = (searchParams.get('sortDir') ?? 'asc') as 'asc' | 'desc';
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useUsers({
    search: debouncedSearch,
    role,
    status,
    sortBy,
    sortDir,
    page: 1,
    pageSize: VIRTUAL_PAGE_SIZE,
  });

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
    try {
      await Promise.all([...selected].map((id) => deleteUser.mutateAsync(id)));
      setSelected(new Set());
      toast.success('Selected users deleted.');
    } catch {
      toast.error('Failed to delete selected users.');
    }
  }

  async function handleBulkSuspend() {
    try {
      await Promise.all(
        [...selected].map((id) => updateUser.mutateAsync({ id, payload: { status: 'suspended' } }))
      );
      setSelected(new Set());
      toast.success('Selected users suspended.');
    } catch {
      toast.error('Failed to suspend selected users.');
    }
  }
  const users: User[] = data?.data ?? [];
  // TanStack Virtual intentionally returns imperative helpers that React Compiler flags.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => tableScrollRef.current,
    estimateSize: () => USER_ROW_HEIGHT,
    overscan: 12,
    getItemKey: (index) => users[index]?.id ?? index,
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Clear selection when page/filters change
  const pageKey = searchParams.toString();
  useEffect(() => {
    setSelected(new Set());
    setExpanded(new Set());
  }, [pageKey]);

  const allLoadedSelected = users.length > 0 && users.every((u) => selected.has(u.id));
  const someLoadedSelected = users.some((u) => selected.has(u.id)) && !allLoadedSelected;

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allLoadedSelected) {
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

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    window.requestAnimationFrame(() => rowVirtualizer.measure());
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

      {/* Virtualized table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1120px] text-sm">
            <div
              className="sticky top-0 z-10 grid border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
              style={{ gridTemplateColumns: USER_GRID_COLUMNS }}
            >
              <div className="pl-4 pr-2 py-3">
                <input
                  type="checkbox"
                  checked={allLoadedSelected}
                  ref={(el) => { if (el) el.indeterminate = someLoadedSelected; }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              {COLUMNS.map(({ key, label }) => (
                <div key={key} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    {label}
                    <SortIcon col={key} sortBy={sortBy} sortDir={sortDir} />
                  </button>
                </div>
              ))}
              <div className="px-4 py-3" />
            </div>

            {isLoading ? (
              <table className="w-full">
                <tbody>{Array.from({ length: 8 }).map((_, i) => <UserRowSkeleton key={i} />)}</tbody>
              </table>
            ) : isError ? (
              <ErrorState error={error} onRetry={() => void refetch()} />
            ) : users.length === 0 ? (
              <div className="px-4 py-20 text-center">
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
              </div>
            ) : (
              <div ref={tableScrollRef} className="h-[640px] overflow-auto">
                <div
                  className="relative w-full"
                  style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const user = users[virtualRow.index];
                    if (!user) return null;
                    const isExpanded = expanded.has(user.id);

                    return (
                      <div
                        key={user.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        className={cn(
                          'absolute left-0 top-0 grid w-full border-b border-gray-50 dark:border-gray-800 transition-colors',
                          selected.has(user.id)
                            ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        )}
                        style={{
                          minHeight: USER_ROW_HEIGHT,
                          gridTemplateColumns: USER_GRID_COLUMNS,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="pl-4 pr-2 py-3 flex items-center">
                          <input
                            type="checkbox"
                            checked={selected.has(user.id)}
                            onChange={() => toggleOne(user.id)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <div className="px-4 py-3 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleExpanded(user.id)}
                              aria-label={isExpanded ? `Collapse ${user.name}` : `Expand ${user.name}`}
                              aria-expanded={isExpanded}
                              className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                              <ChevronDown size={14} className={cn('transition-transform', isExpanded ? 'rotate-0' : '-rotate-90')} />
                            </button>
                            <Link to={`/users/${user.id}`} className="flex items-center gap-3 group min-w-0">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {user.name}
                            </span>
                            </Link>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                        <div className="px-4 py-3 flex items-center text-gray-600 dark:text-gray-300">{ROLE_LABELS[user.role]}</div>
                        <div className="px-4 py-3 flex items-center">
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_STYLES[user.status])}>
                            {user.status}
                          </span>
                        </div>
                        <div className="px-4 py-3 flex items-center text-gray-500 dark:text-gray-400">{formatDate(user.dateJoined)}</div>
                        <div className="px-4 py-3 flex items-center justify-end">
                          <RowActionMenu
                            user={user}
                            onUpdate={(args) => {
                              updateUser.mutate(args, {
                                onSuccess: () => toast.success(`${user.name} updated.`),
                                onError: () => toast.error(`Failed to update ${user.name}.`),
                              });
                            }}
                            onDelete={(id) => {
                              deleteUser.mutate(id, {
                                onSuccess: () => toast.success(`${user.name} deleted.`),
                                onError: () => toast.error(`Failed to delete ${user.name}.`),
                              });
                            }}
                          />
                        </div>
                        {isExpanded && (
                          <div className="col-span-full border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/30 px-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                              <div>
                                <p className="font-medium text-gray-500 dark:text-gray-400">User ID</p>
                                <p className="mt-1 font-mono text-gray-800 dark:text-gray-100">{user.id}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-500 dark:text-gray-400">Account</p>
                                <p className="mt-1 font-mono text-gray-800 dark:text-gray-100">{user.accountId ?? 'Unassigned'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-500 dark:text-gray-400">Last active</p>
                                <p className="mt-1 text-gray-800 dark:text-gray-100">{formatDate(user.lastActive)}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-500 dark:text-gray-400">Security</p>
                                <p className="mt-1 text-gray-800 dark:text-gray-100">
                                  {user.twoFactorEnabled ? '2FA enabled' : '2FA disabled'}
                                  {user.lastIp ? ` · ${user.lastIp}` : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {data && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {users.length.toLocaleString()} of {data.total.toLocaleString()} users
          </span>
          <span>
            Rendering {rowVirtualizer.getVirtualItems().length.toLocaleString()} visible rows
          </span>
        </div>
      )}
    </div>
  );
}
