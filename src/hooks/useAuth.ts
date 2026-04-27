import { useMutation } from '@tanstack/react-query';
import { login as loginRequest, logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials } from '@/types/auth';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
    onSuccess: ({ user, token }, credentials) => {
      login(user, token, credentials.rememberMe ?? false);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => logoutRequest().catch(() => undefined),
    onSettled: () => {
      logout();
    },
  });
}
