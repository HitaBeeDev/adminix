import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import { useCreateAccount } from '@/hooks/useAccounts';
import { toast } from '@/stores/toastStore';
import { cn } from '@/lib/utils';

const schema = z.object({
  name:       z.string().min(2, 'Account name must be at least 2 characters'),
  plan:       z.enum(['free', 'starter', 'pro', 'enterprise'], { message: 'Select a plan' }),
  ownerName:  z.string().min(2, 'Owner name must be at least 2 characters'),
  ownerEmail: z.string().email('Enter a valid email address'),
  ownerId:    z.string().default('usr_placeholder'),
  domain:     z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const PLAN_OPTIONS = [
  { value: 'free',       label: 'Free' },
  { value: 'starter',   label: 'Starter' },
  { value: 'pro',       label: 'Pro' },
  { value: 'enterprise',label: 'Enterprise' },
] as const;

const fieldClass = 'w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const errorClass = 'mt-1 text-xs text-rose-500';

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateAccountModal({ open, onClose }: CreateAccountModalProps) {
  const createAccount = useCreateAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema) });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: FormValues) {
    try {
      const account = await createAccount.mutateAsync(values);
      toast.success(`"${account.name}" account created.`);
      handleClose();
    } catch {
      toast.error('Failed to create account. Please try again.');
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Create Account" description="Set up a new organization account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={labelClass}>Account name</label>
          <input
            {...register('name')}
            placeholder="Acme Corp"
            className={cn(fieldClass, errors.name ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Plan</label>
          <select
            {...register('plan')}
            className={cn(fieldClass, 'appearance-none cursor-pointer', errors.plan ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
          >
            <option value="">Select a plan…</option>
            {PLAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.plan && <p className={errorClass}>{errors.plan.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Owner name</label>
            <input
              {...register('ownerName')}
              placeholder="Jane Smith"
              className={cn(fieldClass, errors.ownerName ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
            />
            {errors.ownerName && <p className={errorClass}>{errors.ownerName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Owner email</label>
            <input
              {...register('ownerEmail')}
              type="email"
              placeholder="jane@example.com"
              className={cn(fieldClass, errors.ownerEmail ? 'border-rose-400 dark:border-rose-600' : 'border-gray-200 dark:border-gray-700')}
            />
            {errors.ownerEmail && <p className={errorClass}>{errors.ownerEmail.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Domain <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            {...register('domain')}
            placeholder="acme.com"
            className={cn(fieldClass, 'border-gray-200 dark:border-gray-700')}
          />
        </div>

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
            disabled={isSubmitting}
            className="px-4 py-2 text-sm rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] font-medium disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
