import { createContext, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronRight, Shield, Clock, Pencil, X, Check,
  ShieldCheck, ShieldOff, Fingerprint, Monitor,
  Smartphone, Globe, RotateCcw,
} from 'lucide-react';
import { useUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import { useActivity } from '@/hooks/useActivity';
import { useRoles } from '@/hooks/useRoles';
import { toast } from '@/stores/toastStore';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ErrorState from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils';
import type { User, UserRole, UserStatus } from '@/types/user';
import type { ActivityEvent } from '@/types/activity';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin',       label: 'Admin' },
  { value: 'manager',     label: 'Manager' },
  { value: 'editor',      label: 'Editor' },
  { value: 'viewer',      label: 'Viewer' },
  { value: 'guest',       label: 'Guest' },
];

const ROLE_LABELS: Record<string, string> = Object.fromEntries(ROLES.map((r) => [r.value, r.label]));

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admin:       'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  manager:     'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  editor:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  viewer:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  guest:       'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

const STATUS_STYLES: Record<UserStatus, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  pending:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const ACTION_LABELS: Record<string, string> = {
  'user:created':        'created a user',
  'user:updated':        'updated a user',
  'user:deleted':        'deleted a user',
  'user:suspended':      'suspended a user',
  'user:reactivated':    'reactivated a user',
  'user:password_reset': 'reset a password',
  'user:role_changed':   'changed a role',
  'account:created':     'created an account',
  'account:updated':     'updated an account',
  'account:suspended':   'suspended an account',
  'account:deleted':     'deleted an account',
  'role:created':        'created a role',
  'role:updated':        'updated a role',
  'role:deleted':        'deleted a role',
  'auth:login':          'logged in',
  'auth:logout':         'logged out',
  'settings:updated':    'updated settings',
};

const DOT_COLORS: Record<string, string> = {
  'user:deleted':      'bg-rose-500',
  'user:suspended':    'bg-amber-500',
  'account:deleted':   'bg-rose-500',
  'account:suspended': 'bg-amber-500',
  'role:deleted':      'bg-rose-500',
  'auth:login':        'bg-emerald-500',
  'auth:logout':       'bg-gray-400',
};

// ─── Form schema ──────────────────────────────────────────────────────────────

const editSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role:  z.enum(['super_admin', 'admin', 'manager', 'editor', 'viewer', 'guest']),
});
type EditValues = z.infer<typeof editSchema>;

interface UserDetailContextValue {
  user: User;
  refreshUser: () => void;
}

const UserDetailContext = createContext<UserDetailContextValue | null>(null);

function useUserDetailContext() {
  const value = useContext(UserDetailContext);
  if (!value) {
    throw new Error('useUserDetailContext must be used within UserDetailContext.Provider');
  }
  return value;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
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

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-4 w-52 rounded bg-gray-100 dark:bg-gray-800" />
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user, refreshUser } = useUserDetailContext();
  const [isEditing, setIsEditing] = useState(false);
  const updateUser = useUpdateUser(user.id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: user.name, email: user.email, role: user.role as EditValues['role'] },
  });

  async function onSubmit(values: EditValues) {
    try {
      await updateUser.mutateAsync(values);
      toast.success('Profile updated.');
      setIsEditing(false);
      refreshUser();
    } catch {
      toast.error('Failed to update profile.');
    }
  }

  function handleCancel() {
    reset({ name: user.name, email: user.email, role: user.role as EditValues['role'] });
    setIsEditing(false);
  }

  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updateUser.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 transition-colors"
            >
              <Check size={13} /> {updateUser.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div>
          <InfoRow label="Full name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', ROLE_COLORS[user.role])}>
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          } />
          <InfoRow label="Account ID" value={
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{user.accountId ?? '—'}</span>
          } />
          <InfoRow label="Member since" value={fmt(user.dateJoined)} />
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          <div>
            <label className={labelClass}>Full name</label>
            <input {...register('name')} className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input {...register('email')} type="email" className={inputClass} />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select {...register('role')} className={cn(inputClass, 'appearance-none cursor-pointer')}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

function ActivityItem({ event }: { event: ActivityEvent }) {
  const dot = DOT_COLORS[event.action] ?? 'bg-indigo-500';
  return (
    <div className="flex gap-3 py-3 first:pt-0">
      <div className="flex flex-col items-center pt-1">
        <span className={cn('w-2 h-2 rounded-full shrink-0', dot)} />
        <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 mt-1.5" />
      </div>
      <div className="flex-1 min-w-0 pb-1">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          {ACTION_LABELS[event.action] ?? event.action}
          {event.targetName && <> — <span className="font-medium">{event.targetName}</span></>}
        </p>
        {event.ipAddress && (
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{event.ipAddress}</span>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-400 dark:text-gray-500">{fmtRelative(event.timestamp)}</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{fmt(event.timestamp)}</p>
      </div>
    </div>
  );
}

function ActivityTab() {
  const { user } = useUserDetailContext();
  const userId = user.id;
  const { data, isLoading, isError, error, refetch } = useActivity({ userId, page: 1, pageSize: 10 });
  const events = data?.data ?? [];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <Link
          to={`/activity?userId=${userId}`}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800 mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-56 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} className="py-12" />
      ) : events.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-2 text-center">
          <Clock size={28} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No activity recorded yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {events.map((e) => <ActivityItem key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}

// ─── Sessions Tab ─────────────────────────────────────────────────────────────

type SessionIcon = 'desktop' | 'mobile' | 'globe';

interface MockSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  icon: SessionIcon;
}

function SessionDeviceIcon({ type }: { type: SessionIcon }) {
  if (type === 'mobile') return <Smartphone size={15} className="text-gray-500 dark:text-gray-400" />;
  if (type === 'globe')  return <Globe      size={15} className="text-gray-500 dark:text-gray-400" />;
  return <Monitor size={15} className="text-gray-500 dark:text-gray-400" />;
}

function SessionsTab() {
  const { user } = useUserDetailContext();
  // Deterministic mock sessions seeded from user data
  const [sessions, setSessions] = useState<MockSession[]>(() => [
    {
      id: `${user.id}-s1`,
      device: 'Chrome on macOS',
      location: 'San Francisco, CA',
      ip: user.lastIp ?? '192.168.1.42',
      lastActive: user.lastActive,
      current: true,
      icon: 'desktop',
    },
    {
      id: `${user.id}-s2`,
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      ip: '192.168.1.55',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current: false,
      icon: 'mobile',
    },
    {
      id: `${user.id}-s3`,
      device: 'Firefox on Windows',
      location: 'New York, NY',
      ip: '203.0.113.12',
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      current: false,
      icon: 'desktop',
    },
  ]);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function revokeSession(id: string) {
    setRevokingId(id);
    await new Promise((r) => setTimeout(r, 500));
    setSessions((s) => s.filter((sess) => sess.id !== id));
    setRevokingId(null);
    toast.success('Session revoked.');
  }

  if (user.status === 'suspended') {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Active Sessions</h2>
        <div className="py-10 flex flex-col items-center gap-2 text-center">
          <Monitor size={24} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No active sessions</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">This account is suspended.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Devices currently signed in</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={() => {
              setSessions((s) => s.filter((sess) => sess.current));
              toast.success('All other sessions revoked.');
            }}
            className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition"
          >
            Revoke all others
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2 text-center">
          <Monitor size={24} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">All sessions have been revoked.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <SessionDeviceIcon type={session.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{session.device}</p>
                  {session.current && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  {session.location} · {session.ip} · {fmtRelative(session.lastActive)}
                </p>
              </div>
              {!session.current && (
                <button
                  onClick={() => revokeSession(session.id)}
                  disabled={revokingId === session.id}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition disabled:opacity-50 shrink-0"
                >
                  {revokingId === session.id ? 'Revoking…' : 'Revoke'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Permissions Tab ──────────────────────────────────────────────────────────

function PermissionsTab() {
  const { user } = useUserDetailContext();
  const { data, isLoading, isError, error, refetch } = useRoles();

  const roleRecord = data?.data.find(
    (r) => r.name.toLowerCase().replace(/\s+/g, '_') === user.role,
  );
  const allPermissions = data?.permissions ?? [];
  const groups = [...new Set(allPermissions.map((p) => p.group))];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Permissions</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Granted via the <span className={cn('font-medium', ROLE_COLORS[user.role]?.split(' ')[1])}>{ROLE_LABELS[user.role]}</span> role
          </p>
        </div>
        <Link to="/roles" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          Manage roles →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} className="py-12" />
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                {group}
              </p>
              <div className="space-y-1.5">
                {allPermissions.filter((p) => p.group === group).map((perm) => {
                  const granted = roleRecord?.permissions.includes(perm.key) ?? false;
                  return (
                    <div key={perm.key} className="flex items-start gap-2.5">
                      <div className={cn(
                        'mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 text-white',
                        granted
                          ? 'bg-indigo-500 dark:bg-indigo-600'
                          : 'bg-gray-100 dark:bg-gray-800',
                      )}>
                        {granted && (
                          <Check size={10} strokeWidth={3} />
                        )}
                      </div>
                      <div>
                        <p className={cn(
                          'text-sm',
                          granted
                            ? 'text-gray-800 dark:text-gray-100'
                            : 'text-gray-400 dark:text-gray-600 line-through',
                        )}>
                          {perm.label}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{perm.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const { user } = useUserDetailContext();
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Security & Access</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
            user.twoFactorEnabled
              ? 'bg-emerald-100 dark:bg-emerald-900/30'
              : 'bg-gray-100 dark:bg-gray-800',
          )}>
            <Fingerprint size={18} className={user.twoFactorEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
            <p className={cn('text-xs mt-0.5', user.twoFactorEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400')}>
              {user.twoFactorEnabled ? 'Enabled — account is protected' : 'Disabled — account is less secure'}
            </p>
          </div>
          <div className="ml-auto shrink-0">
            {user.twoFactorEnabled
              ? <ShieldCheck size={18} className="text-emerald-500" />
              : <ShieldOff  size={18} className="text-gray-300 dark:text-gray-600" />
            }
          </div>
        </div>

        <div className="px-1">
          <InfoRow
            label="Last IP address"
            value={
              user.lastIp
                ? <span className="font-mono text-xs">{user.lastIp}</span>
                : <span className="text-gray-400">—</span>
            }
          />
          <InfoRow label="Last active" value={fmt(user.lastActive)} />
          <InfoRow label="Account created" value={fmt(user.dateJoined)} />
          <InfoRow
            label="Account status"
            value={
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_STYLES[user.status])}>
                {user.status}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'activity' | 'sessions' | 'permissions' | 'security';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [confirmDelete, setConfirmDelete]   = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmReset, setConfirmReset]     = useState(false);
  const [resetting, setResetting]           = useState(false);

  const { data: user, isLoading, isError, error, refetch } = useUser(id ?? '');
  const updateUser = useUpdateUser(id ?? '');
  const deleteUser = useDeleteUser();

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-sm text-gray-500 dark:text-gray-400">User not found.</p>
        <Link to="/users" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  async function handleSuspendToggle() {
    const newStatus: UserStatus = user!.status === 'active' ? 'suspended' : 'active';
    try {
      await updateUser.mutateAsync({ status: newStatus });
      toast.success(
        newStatus === 'suspended'
          ? `${user!.name} has been suspended.`
          : `${user!.name} has been reactivated.`,
      );
      setConfirmSuspend(false);
    } catch {
      toast.error(`Failed to ${newStatus === 'suspended' ? 'suspend' : 'reactivate'} ${user!.name}.`);
    }
  }

  async function handleResetPassword() {
    setResetting(true);
    await new Promise((r) => setTimeout(r, 600));
    setResetting(false);
    setConfirmReset(false);
    toast.success(`Password reset email sent to ${user!.email}.`);
  }

  async function handleDelete() {
    try {
      await deleteUser.mutateAsync(user!.id);
      toast.success(`${user!.name} has been deleted.`);
      navigate('/users');
    } catch {
      toast.error(`Failed to delete ${user!.name}.`);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile',     label: 'Profile' },
    { key: 'activity',    label: 'Activity' },
    { key: 'sessions',    label: 'Sessions' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'security',    label: 'Security' },
  ];

  const isSuspended = user.status === 'suspended';

  return (
    <UserDetailContext.Provider value={{ user, refreshUser: () => void refetch() }}>
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/users" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          Users
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{user.name}</span>
      </nav>

      {/* Header card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {initials(user.name)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', ROLE_COLORS[user.role])}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_STYLES[user.status])}>
                  {user.status}
                </span>
                {user.twoFactorEnabled && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <Shield size={10} /> 2FA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw size={13} /> Reset Password
            </button>
            <button
              onClick={() => setConfirmSuspend(true)}
              disabled={updateUser.isPending}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 text-sm rounded-lg border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                tab === t.key
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === 'profile'     && <ProfileTab />}
      {tab === 'activity'    && <ActivityTab />}
      {tab === 'sessions'    && <SessionsTab />}
      {tab === 'permissions' && <PermissionsTab />}
      {tab === 'security'    && <SecurityTab />}

      {/* Suspend / Reactivate confirm */}
      <ConfirmDialog
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        onConfirm={handleSuspendToggle}
        title={isSuspended ? 'Reactivate User' : 'Suspend User'}
        description={
          isSuspended
            ? `Reactivate ${user.name}'s account? They will regain access immediately.`
            : `Suspend ${user.name}'s account? They will lose access until reactivated.`
        }
        confirmLabel={isSuspended ? 'Reactivate' : 'Suspend'}
        loading={updateUser.isPending}
      />

      {/* Reset Password confirm */}
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleResetPassword}
        title="Reset Password"
        description={`Send a password reset email to ${user.email}?`}
        confirmLabel="Send Reset Email"
        loading={resetting}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        confirmLabel="Delete User"
        loading={deleteUser.isPending}
      />
    </div>
    </UserDetailContext.Provider>
  );
}
