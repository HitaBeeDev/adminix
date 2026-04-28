import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';

interface ErrorStateProps {
  title?: string;
  error?: unknown;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Unable to load data',
  error,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
        <AlertTriangle size={22} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-headline">{title}</p>
        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description ?? getErrorMessage(error)}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}
