import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { handlers } from '@/mocks/handlers';
import { useUpdateUser } from '@/hooks/useUsers';
import type { User } from '@/types/user';
import type { ReactNode } from 'react';

const SEED_USER: User = {
  id: 'usr_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@adminix.dev',
  role: 'super_admin',
  status: 'active',
  lastActive: '2026-04-08T08:12:00Z',
  dateJoined: '2020-01-01T00:00:00Z',
  twoFactorEnabled: true,
  accountId: 'acc_01',
};

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useUpdateUser: optimistic status toggle', () => {
  it('flips status immediately in the cache and reverts it when the API returns 500', async () => {
    // Use a manually-resolved promise so we control exactly when the PUT completes.
    // A fixed delay risks racing waitFor's 50ms polling interval.
    let resolvePut!: () => void;
    const putGate = new Promise<void>((resolve) => { resolvePut = resolve; });

    server.use(
      http.put('/api/users/usr_01', async () => {
        await putGate; // blocks until we explicitly release it below
        return new HttpResponse(null, { status: 500 });
      }),
    );

    // Do NOT use gcTime: 0 — React Query would immediately GC the seeded cache
    // entry (no active observer), so onMutate would find prevDetail = undefined.
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    queryClient.setQueryData<User>(['users', 'usr_01'], SEED_USER);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateUser('usr_01'), { wrapper });

    act(() => {
      result.current.mutate({ status: 'suspended' });
    });

    // onMutate runs before the API responds — optimistic update should be visible
    await waitFor(() => {
      expect(queryClient.getQueryData<User>(['users', 'usr_01'])?.status).toBe('suspended');
    });

    // Release the PUT so it returns 500 → onError reverts the snapshot
    resolvePut();

    await waitFor(() => {
      expect(queryClient.getQueryData<User>(['users', 'usr_01'])?.status).toBe('active');
    });
  });
});
