import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';

const REMEMBER_KEY = 'adminix-remember-me';
const STORE_KEY = 'adminix-auth';

// Routes reads/writes to localStorage or sessionStorage based on the rememberMe flag.
// The flag itself lives in localStorage so it survives tab closes.
const adaptiveStorage = {
  getItem: (name: string): StorageValue<AuthState> | null => {
    const raw = localStorage.getItem(name) ?? sessionStorage.getItem(name);
    return raw ? (JSON.parse(raw) as StorageValue<AuthState>) : null;
  },
  setItem: (name: string, value: StorageValue<AuthState>): void => {
    const storage = localStorage.getItem(REMEMBER_KEY) === 'true'
      ? localStorage
      : sessionStorage;
    storage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string, rememberMe: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token, rememberMe) => {
        // Set the flag BEFORE state update so adaptiveStorage.setItem routes correctly.
        if (rememberMe) {
          localStorage.setItem(REMEMBER_KEY, 'true');
          sessionStorage.removeItem(STORE_KEY);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
          localStorage.removeItem(STORE_KEY);
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem(REMEMBER_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: STORE_KEY, storage: adaptiveStorage }
  )
);
