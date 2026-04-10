import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'h-9 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition-colors',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'dark:bg-gray-900 dark:text-gray-100',
            'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            error
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-700',
            'disabled:pointer-events-none disabled:opacity-50',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
