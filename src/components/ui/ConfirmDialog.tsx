import { AlertTriangle, Info } from 'lucide-react';
import Modal from './Modal';
import { cn } from '@/lib/utils';

type Intent = 'destructive' | 'default';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  loading?: boolean;
  intent?: Intent;
}

const intentConfig: Record<
  Intent,
  { icon: React.ReactNode; iconWrap: string; confirmBtn: string }
> = {
  destructive: {
    icon: <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />,
    iconWrap: 'bg-rose-100 dark:bg-rose-900/30',
    confirmBtn:
      'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white',
  },
  default: {
    icon: <Info size={16} className="text-indigo-600 dark:text-indigo-400" />,
    iconWrap: 'bg-indigo-100 dark:bg-indigo-900/30',
    confirmBtn:
      'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white',
  },
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loadingLabel,
  loading = false,
  intent = 'destructive',
}: ConfirmDialogProps) {
  const config = intentConfig[intent];

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
              config.iconWrap,
            )}
          >
            {config.icon}
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
              config.confirmBtn,
            )}
          >
            {loading ? (loadingLabel ?? `${confirmLabel}…`) : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
