import { cn } from '@/lib/utils';

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function Card({ header, footer, className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        className,
      )}
    >
      {header && (
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          {header}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
