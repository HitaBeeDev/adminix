import { Moon, Sun } from "lucide-react";

interface TopbarThemeButtonProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function TopbarThemeButton({ isDark, onToggleTheme }: TopbarThemeButtonProps) {
  return (
    <button
      onClick={onToggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-[2.4rem] h-[2.4rem] flex items-center justify-center rounded-full bg-[#ffffff] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors focus-visible:outline-none shadow-[0_16px_34px_-28px_rgba(15,23,42,0.12)] dark:bg-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white dark:shadow-none"
    >
      {isDark ? <Sun strokeWidth={1.35} size={18} /> : <Moon strokeWidth={1.35} size={18} />}
    </button>
  );
}
