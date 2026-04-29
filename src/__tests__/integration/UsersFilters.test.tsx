import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { handlers } from '@/mocks/handlers';
import { UsersPage } from '@/pages/UsersPage/UsersPage';
import { renderWithProviders } from './helpers';

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UsersPage: URL-driven filters', () => {
  it('typing in the search field updates the URL search param', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />);

    const input = screen.getByPlaceholderText('Search by name or email...');
    await user.type(input, 'sarah');

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toContain('search=sarah');
    });
  });

  it('selecting role + status filters adds both params to the URL simultaneously', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />);

    // UsersToolbar renders role then status select; both initially show their "All…" option
    await user.selectOptions(screen.getByDisplayValue('All roles'), 'admin');
    await user.selectOptions(screen.getByDisplayValue('All statuses'), 'active');

    await waitFor(() => {
      const loc = screen.getByTestId('location').textContent ?? '';
      expect(loc).toContain('role=admin');
      expect(loc).toContain('status=active');
    });
  });
});
