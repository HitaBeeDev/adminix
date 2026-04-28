import { ACTION_ITEMS, ALL_PALETTE_ITEMS, NAV_ITEMS } from "./commandPalette.constants";
import type { PaletteItem } from "./commandPalette.types";

export function filterPaletteItems(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return ALL_PALETTE_ITEMS;

  return ALL_PALETTE_ITEMS.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
}

export function splitPaletteItems(filteredItems: PaletteItem[]) {
  const navLabels = new Set(NAV_ITEMS.map((item) => item.label));
  const actionLabels = new Set(ACTION_ITEMS.map((item) => item.label));

  const navItems = filteredItems.filter((item) => navLabels.has(item.label));
  const actionItems = filteredItems.filter((item) => actionLabels.has(item.label));

  return {
    navItems,
    actionItems,
    navOffset: 0,
    actionOffset: navItems.length,
  };
}
