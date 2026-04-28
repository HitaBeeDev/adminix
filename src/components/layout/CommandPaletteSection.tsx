import type { PaletteItem } from "./commandPalette.types";

interface CommandPaletteSectionProps {
  activeIndex: number;
  items: PaletteItem[];
  label: string;
  offset: number;
  onHover: (index: number) => void;
  onSelect: (item: PaletteItem) => void;
}

export function CommandPaletteSection({
  activeIndex,
  items,
  label,
  offset,
  onHover,
  onSelect,
}: CommandPaletteSectionProps) {
  return (
    <>
      <p className="px-3 pt-3 pb-1 text-[0.6875rem] font-medium tracking-widest uppercase text-[#94a3b8]">
        {label}
      </p>
      {items.map((item, localIndex) => {
        const globalIndex = offset + localIndex;
        const isActive = globalIndex === activeIndex;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onMouseEnter={() => onHover(globalIndex)}
            onClick={() => onSelect(item)}
            className={`mx-1 flex w-[calc(100%_-_8px)] items-center gap-3 rounded-md px-3 py-2 text-left transition-colors duration-100 ${isActive ? "bg-[#eef2ff]" : "bg-transparent hover:bg-[#f8fafc]"}`}
          >
            <Icon size={16} className={`shrink-0 ${isActive ? "text-[#6366f1]" : "text-[#94a3b8]"}`} />
            <span className={`flex-1 text-[0.85rem] ${isActive ? "text-[#0f172a] font-[500]" : "text-[#64748b] font-[400]"}`}>
              {item.label}
            </span>
            {item.kbd && (
              <kbd className="text-[0.6875rem] font-medium px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[#64748b]">
                {item.kbd}
              </kbd>
            )}
            {isActive && (
              <kbd className="text-[0.6875rem] font-medium px-1.5 py-0.5 rounded bg-[#eef2ff] text-[#6366f1]">
                ↵
              </kbd>
            )}
          </button>
        );
      })}
    </>
  );
}
