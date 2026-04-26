import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { Search, MoreHorizontal, Eye, Ban, RefreshCw } from 'lucide-react';
import { useAccounts, useUpdateAccountInline } from '@/hooks/useAccounts';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/stores/toastStore';
import CreateAccountModal from '@/components/features/CreateAccountModal';
import { cn } from '@/lib/utils';
import type { AccountPlan, AccountStatus, Account } from '@/types/account';

const PLAN_OPTIONS: { value: AccountPlan | ''; label: string }[] = [
  { value: '',           label: 'All plans' },
  { value: 'free',      label: 'Free' },
  { value: 'starter',   label: 'Starter' },
  { value: 'pro',       label: 'Pro' },
  { value: 'enterprise',label: 'Enterprise' },
];

const STATUS_OPTIONS: { value: AccountStatus | ''; label: string }[] = [
  { value: '',          label: 'All statuses' },
  { value: 'active',    label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'trial',     label: 'Trial' },
];

const PLAN_STYLES: Record<AccountPlan, string> = {
  free:       'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  starter:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pro:        'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const STATUS_STYLES: Record<AccountStatus, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  trial:     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function RowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {[48, 32, 56, 20, 24, 36].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: w * 2 }} />
        </td>
      ))}
      <td className="px-4 py-3.5"><div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" /></td>
    </tr>
  );
}

interface ActionMenuProps {
  account: Account;
  onToggleSuspend: () => void;
}

function ActionMenu({ account, onToggleSuspend }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function act(fn: () => void) { fn(); setOpen(false); }

  const isSuspended = account.status === 'suspended';

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
            <button onClick={() => act(() => navigate(`/accounts/${account.id}`))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Eye size={14} className="text-gray-400" /> View
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 py-1">
            <button
              onClick={() => act(onToggleSuspend)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {isSuspended ? <RefreshCw size={14} /> : <Ban size={14} />}
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  const searchInput = searchParams.get('search') ?? '';
  const plan        = (searchParams.get('plan')   ?? '') as AccountPlan   | '';
  const status      = (searchParams.get('status') ?? '') as AccountStatus | '';
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading } = useAccounts({
    search: debouncedSearch,
    plan,
    status,
    page: Number(searchParams.get('page') ?? 1),
    pageSize: 10,
  });

  const updateAccount = useUpdateAccountInline();

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    });
  }

  function handleFilter(key: 'plan' | 'status', value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.delete('page');
      return next;
    });
  }

  async function handleToggleSuspend(account: Account) {
    const newStatus = account.status === 'suspended' ? 'active' : 'suspended';
    try {
      await updateAccount.mutateAsync({ id: account.id, payload: { status: newStatus } });
      toast.success(`"${account.name}" ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}.`);
    } catch {
      toast.error('Failed to update account.');
    }
  }

  const accounts = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="block h-4 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : `${data?.total ?? 0} accounts`}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          + New account
        </button>
      </div>

      <CreateAccountModal open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setParam('search', e.target.value || null)}
            placeholder="Search by name, owner, or domain…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <select
          value={plan}
          onChange={(e) => handleFilter('plan', e.target.value)}
          className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
        >
          {PLAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={status}
          onChange={(e) => handleFilter('status', e.target.value)}
          className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Name', 'Plan', 'Owner', 'Members', 'Status', 'Created'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Search size={20} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No accounts found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {debouncedSearch || plan || status ? 'Try adjusting your filters' : 'Create your first account to get started'}
                        </p>
                      </div>
                      {(debouncedSearch || plan || status) && (
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
                accounts.map((account) => (
                  <tr key={account.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <Link to={`/accounts/${account.id}`} className="group">
                        <p className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {account.name}
                        </p>
                        {account.domain && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{account.domain}</p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize', PLAN_STYLES[account.plan])}>
                        {account.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-gray-700 dark:text-gray-300">{account.ownerName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{account.ownerEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{account.membersCount}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_STYLES[account.status])}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{formatDate(account.createdDate)}</td>
                    <td className="px-4 py-3.5">
                      <ActionMenu account={account} onToggleSuspend={() => handleToggleSuspend(account)} />
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
                  <span key={`e-${i}`} className="px-2 py-1.5 text-gray-400">…</span>
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
