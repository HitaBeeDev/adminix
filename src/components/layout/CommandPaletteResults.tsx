import { CommandPaletteSection } from "./CommandPaletteSection";
import type { PaletteItem } from "./commandPalette.types";
import { splitPaletteItems } from "./commandPalette.utils";

interface CommandPaletteResultsProps {
  activeIndex: number;
  filteredItems: PaletteItem[];
  onHover: (index: number) => void;
  onSelect: (item: PaletteItem) => void;
  query: string;
}

export function CommandPaletteResults({
  activeIndex,
  filteredItems,
  onHover,
  onSelect,
  query,
}: CommandPaletteResultsProps) {
  const { actionItems, actionOffset, navItems, navOffset } = splitPaletteItems(filteredItems);

  return (
    <div className="max-h-80 overflow-y-auto py-1.5">
      {filteredItems.length === 0 ? (
        <p className="px-4 py-6 text-sm text-center text-[#94a3b8]">
          No results for &ldquo;{query}&rdquo;
        </p>
      ) : (
        <>
          {navItems.length > 0 && (
            <CommandPaletteSection
              activeIndex={activeIndex}
              items={navItems}
              label="Navigation"
              offset={navOffset}
              onHover={onHover}
              onSelect={onSelect}
            />
          )}
          {actionItems.length > 0 && (
            <CommandPaletteSection
              activeIndex={activeIndex}
              items={actionItems}
              label="Actions"
              offset={actionOffset}
              onHover={onHover}
              onSelect={onSelect}
            />
          )}
        </>
      )}
    </div>
  );
}
