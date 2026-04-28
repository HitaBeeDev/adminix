import type { KeyboardEvent } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Search } from "lucide-react";
import type { CommandPaletteFormValues } from "./commandPalette.types";

interface CommandPaletteSearchProps {
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onQueryChange: () => void;
  register: UseFormRegister<CommandPaletteFormValues>;
}

export function CommandPaletteSearch({ onKeyDown, onQueryChange, register }: CommandPaletteSearchProps) {
  return (
    <div className="flex items-center gap-3 px-4 h-12 border-b border-[#e2e8f0]">
      <Search size={16} className="shrink-0 text-[#94a3b8]" />
      <input
        {...register("query", { onChange: onQueryChange })}
        onKeyDown={onKeyDown}
        placeholder="Type a command or search..."
        className="flex-1 text-sm text-[#0f172a] placeholder:text-[#94a3b8] bg-transparent outline-none"
      />
      <kbd className="text-[0.6875rem] font-medium px-1.5 py-0.5 rounded shrink-0 bg-[#f1f5f9] text-[#64748b]">
        esc
      </kbd>
    </div>
  );
}
