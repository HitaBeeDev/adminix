import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type ThemeOption,
  getThemePreference,
  setThemePreference,
} from '@/lib/theme';

interface UiState {
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  commandPaletteOpen: boolean;
  theme: ThemeOption;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setTheme: (v: ThemeOption) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileOpen: false,
      commandPaletteOpen: false,
      theme: getThemePreference(),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setTheme: (theme) => {
        setThemePreference(theme); // applies to DOM + persists via lib/theme
        set({ theme });
      },
    }),
    {
      name: 'adminix-ui',
      // Only persist sidebar collapse preference; other state is transient
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
