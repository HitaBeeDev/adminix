import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import type { ToastType } from '@/stores/toastStore';
import { cn } from '@/lib/utils';

const STYLES: Record<ToastType, { container: string; icon: string; Icon: React.ElementType }> = {
  success: {
    container: 'bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-500',
    Icon: CheckCircle,
  },
  error: {
    container: 'bg-white dark:bg-gray-900 border-rose-200 dark:border-rose-800',
    icon: 'text-rose-500',
    Icon: XCircle,
  },
  info: {
    container: 'bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800',
    icon: 'text-indigo-500',
    Icon: Info,
  },
};

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 w-80">
      {toasts.map((t) => {
        const { container, icon, Icon } = STYLES[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200',
              container,
            )}
          >
            <Icon size={17} className={cn('mt-0.5 shrink-0', icon)} />
            <p className="flex-1 text-sm text-gray-700 dark:text-gray-200">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
