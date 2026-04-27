import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, fetchUser, createUser, updateUser, deleteUser } from '@/api/users';
import type { UserFilters, CreateUserPayload, UpdateUserPayload, User, PaginatedUsers } from '@/types/user';

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

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['users'] });

      const prevDetail = qc.getQueryData<User>(['users', id]);
      if (prevDetail) {
        qc.setQueryData<User>(['users', id], { ...prevDetail, ...payload });
      }

      // Patch matching row in every paginated list cache
      qc.setQueriesData<PaginatedUsers>({ queryKey: ['users'] }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((u) => u.id === id ? { ...u, ...payload } : u) };
      });

      return { prevDetail };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prevDetail) qc.setQueryData(['users', id], ctx.prevDetail);
      void qc.invalidateQueries({ queryKey: ['users'] });
    },

    onSettled: () => qc.invalidateQueries({ queryKey: ['users'] }),
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
