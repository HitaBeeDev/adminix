import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { handlers } from '@/mocks/handlers';
import InviteUserModal from '@/components/features/InviteUserModal';
import { renderWithProviders } from './helpers';

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('InviteUserModal', () => {
  it('submitting a valid form fires the mutation and closes the modal', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<InviteUserModal open={true} onClose={onClose} />);

    // Wait for the accounts to finish loading (select transitions from "Loading…" to "Select an account…")
    await screen.findByDisplayValue('Select an account…');

    await user.type(screen.getByPlaceholderText('Jane Smith'), 'Jane Smith');
    await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
    await user.selectOptions(screen.getByDisplayValue('Select a role…'), 'admin');
    await user.selectOptions(screen.getByDisplayValue('Select an account…'), 'acc_01');

    await user.click(screen.getByRole('button', { name: /invite user/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it('submitting an empty form shows field-level errors and does NOT fire the mutation', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    let postFired = false;
    server.use(
      http.post('/api/users', () => {
        postFired = true;
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    renderWithProviders(<InviteUserModal open={true} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /invite user/i }));

    await waitFor(() => {
      // Use { selector: 'p' } so the query doesn't accidentally match <option> text
      expect(screen.getByText(/name must be at least 2 characters/i, { selector: 'p' })).toBeInTheDocument();
      expect(screen.getByText(/enter a valid email address/i, { selector: 'p' })).toBeInTheDocument();
      expect(screen.getByText(/select a role/i, { selector: 'p' })).toBeInTheDocument();
      expect(screen.getByText(/select an account/i, { selector: 'p' })).toBeInTheDocument();
    });

    expect(postFired).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});
