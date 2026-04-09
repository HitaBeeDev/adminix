import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, fetchUser, createUser, updateUser, deleteUser } from '@/api/users';
import type { UserFilters, CreateUserPayload, UpdateUserPayload } from '@/types/user';

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// For list-context mutations where the id comes per-action, not per-hook
export function useUpdateUserInline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
