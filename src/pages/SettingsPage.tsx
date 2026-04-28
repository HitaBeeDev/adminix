import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Bell, Palette, Shield, Camera, Monitor, Sun, Moon,
  Smartphone, Globe, LogOut, Key, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { cn } from '@/lib/utils';
import { useTheme, type ThemeOption } from '@/lib/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'appearance',    label: 'Appearance',     icon: Palette },
  { id: 'security',      label: 'Security',       icon: Shield },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Shared styles ────────────────────────────────────────────────────────────

const fieldClass =
  'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const errorClass = 'mt-1 text-xs text-rose-500';

const sectionClass =
  'rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6';

// ─── Profile Tab ──────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name:  z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  title: z.string().optional(),
  bio:   z.string().max(200, 'Max 200 characters').optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

const appearanceSchema = z.object({
  density: z.enum(['compact', 'comfortable', 'spacious']),
});
type AppearanceValues = z.infer<typeof appearanceSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: z.string().min(8, 'Use at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your new password'),
}).refine((values) => values.newPassword === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type PasswordValues = z.infer<typeof passwordSchema>;

function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name:  user?.name  ?? '',
      email: user?.email ?? '',
      title: 'Product Manager',
      bio:   'Building great admin interfaces, one component at a time.',
    },
  });

  function initials(name: string) {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  async function onSubmit() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success('Profile updated.');
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Avatar</h3>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-[#4fc4cf] flex items-center justify-center text-xl font-bold text-[#181818] select-none">
              {user ? initials(user.name) : 'AU'}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user?.email}</p>
            <button className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              Upload photo
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(JPG, PNG — max 2 MB)</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input {...register('name')} className={fieldClass} />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input {...register('email')} type="email" className={fieldClass} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Job Title</label>
              <input {...register('title')} className={fieldClass} placeholder="e.g. Product Manager" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              {...register('bio')}
              rows={3}
              className={cn(fieldClass, 'resize-none')}
              placeholder="A short description about yourself"
            />
            {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[#4fc4cf] text-[#181818] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

interface NotifGroup {
  group: string;
  items: { key: string; label: string; description: string }[];
}

const NOTIF_GROUPS: NotifGroup[] = [
  {
    group: 'User Activity',
    items: [
      { key: 'user_invite',    label: 'User invitations',     description: 'When a new user is invited to the platform' },
      { key: 'user_joined',    label: 'New user joined',       description: 'When an invitation is accepted' },
      { key: 'user_suspended', label: 'User suspended',        description: 'When a user account is suspended' },
    ],
  },
  {
    group: 'Account Events',
    items: [
      { key: 'account_created',   label: 'Account created',    description: 'When a new organization account is added' },
      { key: 'account_suspended', label: 'Account suspended',  description: 'When an account is suspended' },
    ],
  },
  {
    group: 'Security',
    items: [
      { key: 'new_login',     label: 'New sign-in detected',   description: 'When your account is accessed from a new device' },
      { key: 'password_changed', label: 'Password changed',    description: 'When your password is updated' },
      { key: 'role_changed',  label: 'Role changed',           description: 'When your role or permissions change' },
    ],
  },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        checked ? 'bg-[#4fc4cf]' : 'bg-gray-200 dark:bg-gray-700',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NOTIF_GROUPS.flatMap((g) => g.items.map((i) => [i.key, true]))
    )
  );

  function toggle(key: string) {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      toast.success('Notification preference saved.');
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {NOTIF_GROUPS.map((group) => (
        <div key={group.group} className={sectionClass}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{group.group}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Email and in-app notifications</p>
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            {group.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

const THEMES: { value: ThemeOption; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'light',  label: 'Light',  icon: Sun,     desc: 'Classic light background' },
  { value: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Easy on the eyes' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Follow OS preference' },
];

const DENSITY_OPTIONS = [
  { value: 'compact',      label: 'Compact',      desc: 'More content, less space' },
  { value: 'comfortable',  label: 'Comfortable',  desc: 'Balanced spacing (default)' },
  { value: 'spacious',     label: 'Spacious',     desc: 'More breathing room' },
] as const;

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { register, control } = useForm<AppearanceValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { density: 'comfortable' },
  });
  const density = useWatch({ control, name: 'density' }) ?? 'comfortable';

  function applyTheme(value: ThemeOption) {
    setTheme(value);
    toast.success('Appearance updated.');
  }

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Theme</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Choose how Adminix looks to you</p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              onClick={() => applyTheme(value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
                theme === value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                theme === value
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
              )}>
                <Icon size={18} />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  theme === value
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300',
                )}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
              </div>
              {theme === value && (
                <CheckCircle2 size={14} className="text-indigo-500 absolute top-2 right-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Display Density</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Control how compact the UI feels</p>
        <div className="space-y-2">
          {DENSITY_OPTIONS.map(({ value, label, desc }) => (
            <label
              key={value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
                density === value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              )}
            >
              <input
                type="radio"
                value={value}
                {...register('density')}
                className="accent-indigo-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  icon: 'desktop' | 'mobile' | 'globe';
}

const MOCK_SESSIONS: Session[] = [
  { id: 's1', device: 'Chrome on macOS',   location: 'San Francisco, CA', ip: '192.168.1.42',  lastActive: 'Active now',  current: true,  icon: 'desktop' },
  { id: 's2', device: 'Safari on iPhone',  location: 'San Francisco, CA', ip: '192.168.1.55',  lastActive: '2h ago',      current: false, icon: 'mobile'  },
  { id: 's3', device: 'Firefox on Windows',location: 'New York, NY',      ip: '203.0.113.12',  lastActive: '3 days ago',  current: false, icon: 'desktop' },
  { id: 's4', device: 'Unknown browser',   location: 'London, UK',        ip: '198.51.100.74', lastActive: '12 days ago', current: false, icon: 'globe'   },
];

function SessionIcon({ type }: { type: Session['icon'] }) {
  if (type === 'mobile')  return <Smartphone size={16} className="text-gray-500 dark:text-gray-400" />;
  if (type === 'globe')   return <Globe      size={16} className="text-gray-500 dark:text-gray-400" />;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function SecurityTab() {
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  async function updatePassword() {
    await new Promise((r) => setTimeout(r, 600));
    resetPassword();
    toast.success('Password changed successfully.');
  }

  function handleToggle2FA() {
    if (twoFaEnabled) {
      setTwoFaEnabled(false);
      setShowQr(false);
      toast.info('Two-factor authentication disabled.');
    } else {
      setShowQr(true);
    }
  }

  function confirmEnable() {
    setTwoFaEnabled(true);
    setShowQr(false);
    toast.success('Two-factor authentication enabled.');
  }

  async function revokeSession(id: string) {
    setRevokingId(id);
    await new Promise((r) => setTimeout(r, 600));
    setSessions((s) => s.filter((sess) => sess.id !== id));
    setRevokingId(null);
    toast.success('Session revoked.');
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Password</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Update your account password</p>
        <form onSubmit={handlePasswordSubmit(updatePassword)} className="space-y-3 max-w-sm">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" {...registerPassword('currentPassword')} className={fieldClass} placeholder="••••••••" />
            {passwordErrors.currentPassword && <p className={errorClass}>{passwordErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type="password" {...registerPassword('newPassword')} className={fieldClass} placeholder="••••••••" />
            {passwordErrors.newPassword && <p className={errorClass}>{passwordErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input type="password" {...registerPassword('confirmPassword')} className={fieldClass} placeholder="••••••••" />
            {passwordErrors.confirmPassword && <p className={errorClass}>{passwordErrors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isPasswordSubmitting}
            className="mt-1 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#4fc4cf] text-[#181818] hover:brightness-105 transition"
          >
            <Key size={14} />
            {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className={sectionClass}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Add an extra layer of security using an authenticator app
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              twoFaEnabled
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            )}>
              {twoFaEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Toggle checked={twoFaEnabled} onChange={handleToggle2FA} />
          </div>
        </div>

        {/* QR code mock */}
        {showQr && (
          <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              {/* mock QR */}
              <div className="w-24 h-24 shrink-0 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <svg viewBox="0 0 80 80" width="72" height="72" className="text-gray-900 dark:text-gray-100">
                  {/* simplified QR-like pattern */}
                  <rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <rect x="12" y="12" width="14" height="14" rx="1" fill="currentColor"/>
                  <rect x="46" y="4" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <rect x="54" y="12" width="14" height="14" rx="1" fill="currentColor"/>
                  <rect x="4" y="46" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <rect x="12" y="54" width="14" height="14" rx="1" fill="currentColor"/>
                  <rect x="46" y="46" width="8" height="8" rx="1" fill="currentColor"/>
                  <rect x="58" y="46" width="8" height="8" rx="1" fill="currentColor"/>
                  <rect x="46" y="58" width="8" height="8" rx="1" fill="currentColor"/>
                  <rect x="58" y="58" width="8" height="8" rx="1" fill="currentColor"/>
                  <rect x="70" y="46" width="8" height="20" rx="1" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Scan with your authenticator app</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use Google Authenticator, Authy, or any TOTP-compatible app.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Manual entry key:</p>
                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 select-all">
                  JBSWY3DPEHPK3PXP
                </code>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={confirmEnable}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#4fc4cf] text-[#181818] hover:brightness-105 transition"
                  >
                    <CheckCircle2 size={12} /> Confirm & Enable
                  </button>
                  <button
                    onClick={() => setShowQr(false)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {twoFaEnabled && !showQr && (
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            Your account is protected with two-factor authentication.
          </div>
        )}

        {!twoFaEnabled && !showQr && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle size={13} />
            Your account is not protected with 2FA. We strongly recommend enabling it.
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Active Sessions</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Devices currently signed in to your account
            </p>
          </div>
          <button
            onClick={() => {
              setSessions((s) => s.filter((sess) => sess.current));
              toast.success('All other sessions revoked.');
            }}
            className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition flex items-center gap-1"
          >
            <LogOut size={12} />
            Revoke all others
          </button>
        </div>
        {sessions.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2 text-center">
            <LogOut size={22} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">All other sessions have been revoked.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">You'll be re-authenticated on your next visit.</p>
          </div>
        ) : (
        <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <SessionIcon type={session.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{session.device}</p>
                  {session.current && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                      This device
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  {session.location} · {session.ip} · {session.lastActive}
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
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as TabId | null;
    return tab && TABS.some((t) => t.id === tab) ? tab : 'profile';
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'profile'       && <ProfileTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'appearance'    && <AppearanceTab />}
      {activeTab === 'security'      && <SecurityTab />}
    </div>
  );
}
