import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "link";
type Size = "xs" | "sm" | "md" | "lg" | "icon-sm" | "icon-md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:     "bg-indigo-600 text-white shadow-[0_12px_28px_-18px_#4f46e5] hover:bg-indigo-700 active:brightness-95",
  secondary:   "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 active:brightness-95",
  ghost:       "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 active:brightness-95",
  destructive: "bg-rose-600 text-white hover:bg-rose-700 active:brightness-95",
  link:        "text-indigo-600 dark:text-indigo-400 underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  xs:       "h-7 px-2.5 text-xs gap-1.5",
  sm:       "h-8 px-3 text-sm gap-2",
  md:       "h-9 px-4 text-sm gap-2",
  lg:       "h-10 px-5 text-sm gap-2",
  "icon-sm": "h-8 w-8 p-0",
  "icon-md": "h-9 w-9 p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-2xl transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/25",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
export default Button;
