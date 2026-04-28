import { Search } from "lucide-react";

interface TopbarSearchButtonProps {
  onOpenSearch: () => void;
}

export function TopbarSearchButton({ onOpenSearch }: TopbarSearchButtonProps) {
  return (
    <button
      onClick={onOpenSearch}
      aria-label="Open search"
      className="hidden h-[2.8rem] w-[min(460px,42vw)] items-center gap-3 rounded-full border border-[#e2e8f0] bg-[#ffffff] px-5 text-sm shadow-[0_18px_48px_-38px_rgba(15,23,42,0.12)] transition-colors hover:border-[#6366f1]/30 sm:flex dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none"
    >
      <Search size={18} className="shrink-0 text-[#94a3b8]" />

      <span className="flex-1 text-left text-[0.75rem] text-[#94a3b8] font-[200]">
        Search users, accounts, reports...
      </span>
    </button>
  );
}
