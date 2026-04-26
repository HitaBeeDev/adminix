import { useEffect, useState } from 'react';

export type ThemeOption = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'adminix-theme';
const THEME_CHANGE_EVENT = 'adminix-theme-change';

function isThemeOption(value: string | null): value is ThemeOption {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function getThemePreference(): ThemeOption {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeOption(stored) ? stored : 'system';
}

export function getResolvedTheme(theme = getThemePreference()): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return theme;
}

export function applyThemePreference(theme = getThemePreference()) {
  const resolvedTheme = getResolvedTheme(theme);

  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function setThemePreference(theme: ThemeOption) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyThemePreference(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeOption>(() => getThemePreference());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => getResolvedTheme());

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function syncTheme() {
      const nextTheme = getThemePreference();
      applyThemePreference(nextTheme);
      setTheme(nextTheme);
      setResolvedTheme(getResolvedTheme(nextTheme));
    }

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.addEventListener('storage', syncTheme);
    media.addEventListener('change', syncTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      window.removeEventListener('storage', syncTheme);
      media.removeEventListener('change', syncTheme);
    };
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme: setThemePreference,
    toggleTheme: () => setThemePreference(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}
