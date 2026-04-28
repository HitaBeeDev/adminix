import type { ElementType } from "react";

export interface PaletteItem {
  label: string;
  path: string | null;
  icon: ElementType;
  kbd: string;
}

export interface CommandPaletteFormValues {
  query: string;
}
