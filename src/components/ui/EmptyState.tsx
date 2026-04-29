import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-900 dark:text-[#181818]">{title}</p>
        {description && (
          <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
