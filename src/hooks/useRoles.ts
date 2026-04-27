import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRoles, createRole, updateRole, deleteRole } from '@/api/roles';
import type { CreateRolePayload, PermissionKey } from '@/types/role';

const QUERY_KEY = ['roles'];
type RolesResponse = Awaited<ReturnType<typeof fetchRoles>>;

export function useRoles() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchRoles });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useTogglePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: PermissionKey[] }) =>
      updateRole(roleId, { permissions }),

    onMutate: async ({ roleId, permissions }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY });
      const prev = qc.getQueryData<RolesResponse>(QUERY_KEY);
      qc.setQueryData<RolesResponse>(QUERY_KEY, (old) => old ? ({
        ...old,
        data: old.data.map((r) => r.id === roleId ? { ...r, permissions } : r),
      }) : old);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QUERY_KEY, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
