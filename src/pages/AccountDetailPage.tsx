import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronRight, Building2, Globe, Users, Calendar,
  Crown, AlertTriangle, Pencil, X, Check,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts';
import { useUsers } from '@/hooks/useUsers';
import { toast } from '@/stores/toastStore';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ErrorState from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils';
import type { AccountPlan, AccountStatus } from '@/types/account';
import type { UserRole, UserStatus } from '@/types/user';

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_STYLES: Record<AccountPlan, string> = {
  free:       'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  starter:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pro:        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  enterprise: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const STATUS_STYLES: Record<AccountStatus, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  trial:     'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
};

const USER_ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admin:       'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  manager:     'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  editor:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  viewer:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  guest:       'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

const USER_STATUS_STYLES: Record<UserStatus, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  pending:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
  guest: 'Guest',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Deterministic mock weekly activity data seeded from account id
function mockWeeklyActivity(accountId: string, membersCount: number) {
  const seed = accountId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return DAYS.map((day, i) => ({
    day,
    events: Math.max(1, Math.round(((seed * (i + 3)) % 17) + membersCount * 0.4)),
  }));
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-44 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

// ─── Edit schema ──────────────────────────────────────────────────────────────

const editSchema = z.object({
  name:   z.string().min(1, 'Name is required'),
  domain: z.string().optional(),
});
type EditValues = z.infer<typeof editSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmDelete, setConfirmDelete]   = useState(false);
  const [isEditing, setIsEditing]           = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
  });

  const { data: account, isLoading, isError, error, refetch } = useAccount(id ?? '');
  const updateAccount = useUpdateAccount(id ?? '');
  const deleteAccount = useDeleteAccount();

  const { data: membersData, isLoading: membersLoading } = useUsers(
    account ? { accountId: account.id, pageSize: 50 } : {},
  );
  const members = membersData?.data ?? [];

  if (isLoading) return <PageSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-sm text-gray-500 dark:text-gray-400">Account not found.</p>
        <Link to="/accounts" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Accounts
        </Link>
      </div>
    );
  }

  const currentAccount = account;
  const isSuspended = currentAccount.status === 'suspended';
  const weeklyData  = mockWeeklyActivity(currentAccount.id, currentAccount.membersCount);

  function startEditing() {
    reset({
      name: currentAccount.name,
      domain: currentAccount.domain ?? '',
    });
    setIsEditing(true);
  }

  async function saveEdit(values: EditValues) {
    try {
      await updateAccount.mutateAsync({ name: values.name, domain: values.domain || undefined });
      toast.success('Account updated.');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update account.');
    }
  }

  async function handleSuspendToggle() {
    const newStatus: AccountStatus = isSuspended ? 'active' : 'suspended';
    try {
      await updateAccount.mutateAsync({ status: newStatus });
      toast.success(
        isSuspended ? `${currentAccount.name} reactivated.` : `${currentAccount.name} suspended.`,
      );
      setConfirmSuspend(false);
    } catch {
      toast.error('Failed to update account status.');
    }
  }

  async function handleDelete() {
    try {
      await deleteAccount.mutateAsync(currentAccount.id);
      toast.success(`${currentAccount.name} has been deleted.`);
      navigate('/accounts');
    } catch {
      toast.error('Failed to delete account.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/accounts" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          Accounts
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{account.name}</span>
      </nav>

      {/* Overview card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
              <Building2 size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              {isEditing ? (
                <div>
                  <input
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    className="text-xl font-bold w-full px-2 py-1 rounded-lg border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-headline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.name.message}</p>
                  )}
                </div>
              ) : (
                <h1 className="text-xl font-bold text-gray-900 dark:text-headline">{account.name}</h1>
              )}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', PLAN_STYLES[account.plan])}>
                  {account.plan}
                </span>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_STYLES[account.status])}>
                  {account.status}
                </span>
              </div>
            </div>
          </div>

          {/* Edit / action buttons */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Pencil size={13} /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  onClick={() => void handleSubmit(saveEdit)()}
                  disabled={updateAccount.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-button hover:brightness-105 text-button-text font-medium disabled:opacity-50 transition-colors"
                >
                  <Check size={13} /> {updateAccount.isPending ? 'Saving…' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Detail rows */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
          <div>
            <InfoRow
              label="Owner"
              value={
                <span className="flex items-center gap-1.5">
                  <Crown size={12} className="text-amber-500" />
                  {account.ownerName}
                </span>
              }
            />
            <InfoRow label="Owner email" value={
              <a href={`mailto:${account.ownerEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                {account.ownerEmail}
              </a>
            } />
            <InfoRow label="Members" value={
              <span className="flex items-center gap-1.5">
                <Users size={12} className="text-gray-400" />
                {account.membersCount}
              </span>
            } />
          </div>
          <div>
            <InfoRow
              label="Domain"
              value={
                isEditing ? (
                  <input
                    {...register('domain')}
                    placeholder="e.g. acme.com"
                    className="w-40 px-2 py-1 text-sm rounded-lg border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-headline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : account.domain ? (
                  <span className="flex items-center gap-1.5">
                    <Globe size={12} className="text-gray-400" />
                    {account.domain}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )
              }
            />
            <InfoRow
              label="Created"
              value={
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-gray-400" />
                  {fmt(account.createdDate)}
                </span>
              }
            />
            <InfoRow label="Account ID" value={
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{account.id}</span>
            } />
          </div>
        </div>
      </div>

      {/* Members + Activity grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Members table */}
        <div className="xl:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-headline">Members</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{account.membersCount} total</p>
            </div>
            <Link to={`/users?accountId=${account.id}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View all →
            </Link>
          </div>

          {membersLoading ? (
            <div className="p-5 space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-2.5 w-44 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                  <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-center">
              <Users size={24} className="text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Last active</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const memberInitials = member.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr
                      key={member.id}
                      className="border-t border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link to={`/users/${member.id}`} className="flex items-center gap-2.5 group">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                              {memberInitials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{member.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', USER_ROLE_COLORS[member.role])}>
                          {ROLE_LABELS[member.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', USER_STATUS_STYLES[member.status])}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-400 dark:text-gray-500 hidden md:table-cell">
                        {fmtRelative(member.lastActive)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Activity chart */}
        <div className="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-headline mb-0.5">Weekly Activity</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Audit events by day of week</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-400 dark:text-gray-500"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-400 dark:text-gray-500"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                }}
                cursor={{ fill: 'rgb(243 244 246 / 0.5)' }}
              />
              <Bar dataKey="events" fill="var(--highlight)" radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-rose-200 dark:border-rose-800/50 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-rose-500" />
          <h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          {/* Suspend row */}
          <div className="flex items-start justify-between gap-4 py-4 border-t border-rose-100 dark:border-rose-800/30">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {isSuspended ? 'Reactivate account' : 'Suspend account'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isSuspended
                  ? 'Restore access for all members of this account.'
                  : 'Temporarily disable access for all members. The account and its data are preserved.'}
              </p>
            </div>
            <button
              onClick={() => setConfirmSuspend(true)}
              disabled={updateAccount.isPending}
              className={cn(
                'shrink-0 px-4 py-2 text-sm rounded-lg border transition-colors disabled:opacity-50',
                isSuspended
                  ? 'border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  : 'border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20',
              )}
            >
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </button>
          </div>

          {/* Delete row */}
          <div className="flex items-start justify-between gap-4 py-4 border-t border-rose-100 dark:border-rose-800/30">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Delete account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Permanently delete this account and remove all associated members. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setConfirmDelete(true)}
              className="shrink-0 px-4 py-2 text-sm rounded-lg border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Suspend confirm */}
      <ConfirmDialog
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        onConfirm={handleSuspendToggle}
        title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
        description={
          isSuspended
            ? `Reactivate ${account.name}? Members will regain access immediately.`
            : `Suspend ${account.name}? All ${account.membersCount} member${account.membersCount !== 1 ? 's' : ''} will lose access until reactivated.`
        }
        confirmLabel={isSuspended ? 'Reactivate' : 'Suspend'}
        loading={updateAccount.isPending}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description={`Permanently delete ${account.name}? This will remove all ${account.membersCount} member${account.membersCount !== 1 ? 's' : ''} and cannot be undone.`}
        confirmLabel="Delete Account"
        loading={deleteAccount.isPending}
      />
    </div>
  );
}
