import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
  xl: 'h-14 w-14 text-lg',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const base = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden font-medium select-none',
    sizeClasses[size],
    className,
  );

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={cn(base, 'object-cover')}
      />
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <span className={cn(base, 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300')}>
      {initials}
    </span>
  );
}

export default Avatar;
