import { cn } from '@/lib/utils';

interface SkeletonProps {
  variant?: 'block' | 'text' | 'circle';
  width?: string;
  height?: string;
  lines?: number;
  className?: string;
}

function Skeleton({ variant = 'block', width, height, lines = 1, className }: SkeletonProps) {
  const base = 'animate-pulse rounded bg-gray-200 dark:bg-gray-700';

  if (variant === 'circle') {
    return (
      <div
        className={cn(base, 'rounded-full', className)}
        style={{ width: width ?? '2.5rem', height: height ?? '2.5rem' }}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(base, 'h-4 rounded')}
            style={{
              width: i === lines - 1 && lines > 1 ? '75%' : (width ?? '100%'),
            }}
          />
        ))}
      </div>
    );
  }

  // block (default)
  return (
    <div
      className={cn(base, className)}
      style={{ width: width ?? '100%', height: height ?? '1rem' }}
    />
  );
}

export default Skeleton;
