import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccounts, fetchAccount, createAccount, updateAccount } from '@/api/accounts';
import type { AccountFilters, CreateAccountPayload, UpdateAccountPayload } from '@/types/account';

export function useAccounts(filters: AccountFilters = {}) {
  return useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => fetchAccounts(filters),
    placeholderData: (prev) => prev,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => fetchAccount(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => createAccount(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useUpdateAccountInline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountPayload }) =>
      updateAccount(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
