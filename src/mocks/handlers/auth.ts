import { http, HttpResponse } from 'msw';
import { mockCurrentUser } from '@/mocks/seeds';
import type { LoginCredentials } from '@/types/auth';

const MOCK_PASSWORD = 'password';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginCredentials;

    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    if (body.password !== MOCK_PASSWORD) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({
      user: mockCurrentUser,
      token: 'mock-jwt-token-adminix',
    });
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
