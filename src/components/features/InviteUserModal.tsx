import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import { useAccountOptions } from '@/hooks/useAccounts';
import { useCreateUser } from '@/hooks/useUsers';
import { toast } from '@/stores/toastStore';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';

const schema = z.object({
  name:      z.string().min(2, 'Name must be at least 2 characters'),
  email:     z.string().email('Enter a valid email address'),
  role:      z.enum(['super_admin', 'admin', 'manager', 'editor', 'viewer', 'guest'], {
               message: 'Select a role',
             }),
  accountId: z.string().min(1, 'Select an account'),
});

type FormValues = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin',       label: 'Admin' },
  { value: 'manager',     label: 'Manager' },
  { value: 'editor',      label: 'Editor' },
  { value: 'viewer',      label: 'Viewer' },
  { value: 'guest',       label: 'Guest' },
] as const;

const fieldClass = 'w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const errorClass = 'mt-1 text-xs text-rose-500';

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ open, onClose }: InviteUserModalProps) {
  const createUser = useCreateUser();

  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    error: accountsError,
    refetch: refetchAccounts,
  } = useAccountOptions(open);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: FormValues) {
    try {
      const user = await createUser.mutateAsync(values);
      toast.success(`${user.name} has been invited.`);
      handleClose();
    } catch {
      toast.error('Failed to invite user. Please try again.');
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Invite User" description="Send an invite to a new team member.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className={labelClass}>Full name</label>
          <input
            {...register('name')}
            placeholder="Jane Smith"
            className={cn(fieldClass, errors.name ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="jane@example.com"
            className={cn(fieldClass, errors.email ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label className={labelClass}>Role</label>
          <select
            {...register('role')}
            className={cn(fieldClass, 'appearance-none cursor-pointer', errors.role ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
          >
            <option value="">Select a role…</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.role && <p className={errorClass}>{errors.role.message}</p>}
        </div>

        {/* Account */}
        <div>
          <label className={labelClass}>Account</label>
          {isAccountsError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
              <div className="flex items-center justify-between gap-3">
                <span>{getErrorMessage(accountsError, 'Failed to load accounts.')}</span>
                <button type="button" onClick={() => void refetchAccounts()} className="shrink-0 font-medium underline">
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <select
              {...register('accountId')}
              disabled={isAccountsLoading}
              className={cn(fieldClass, 'appearance-none cursor-pointer disabled:opacity-60', errors.accountId ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
            >
              <option value="">
                {isAccountsLoading
                  ? 'Loading accounts…'
                  : (accountsData?.data.length ?? 0) === 0
                    ? 'No accounts available'
                    : 'Select an account…'}
              </option>
              {accountsData?.data.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          )}
          {errors.accountId && <p className={errorClass}>{errors.accountId.message}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isAccountsLoading || isAccountsError}
            className="px-4 py-2 text-sm rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] font-medium disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Inviting…' : 'Invite user'}
          </button>
        </div>

      </form>
    </Modal>
  );
}
