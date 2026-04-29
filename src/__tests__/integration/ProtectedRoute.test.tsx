import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { renderWithProviders } from './helpers';

beforeEach(() => {
  // Clear persisted auth so each test starts from a known unauthenticated state
  localStorage.clear();
  sessionStorage.clear();
  useAuthStore.getState().logout();
});

const protectedTree = (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<div>Dashboard content</div>} />
    </Route>
    <Route path="/login" element={<div data-testid="login-page">Login page</div>} />
  </Routes>
);

describe('ProtectedRoute', () => {
  it('redirects an unauthenticated user to /login', () => {
    renderWithProviders(protectedTree, { initialUrl: '/dashboard' });

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('renders the protected route for an authenticated user', () => {
    useAuthStore.getState().login(
      { id: 'usr_01', name: 'Alex Morgan', email: 'alex.morgan@adminix.dev', role: 'super_admin' },
      'mock-token',
      false,
    );

    renderWithProviders(protectedTree, { initialUrl: '/dashboard' });

    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
