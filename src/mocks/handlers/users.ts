import { http, HttpResponse } from 'msw';
import { mockUsers } from '@/mocks/seeds';
import type { User, UserFilters, CreateUserPayload, UpdateUserPayload } from '@/types/user';

export const usersHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);

    const search    = url.searchParams.get('search')?.toLowerCase() ?? '';
    const role      = url.searchParams.get('role') ?? '';
    const status    = url.searchParams.get('status') ?? '';
    const accountId = url.searchParams.get('accountId') ?? '';
    const sortBy    = (url.searchParams.get('sortBy') ?? 'name') as UserFilters['sortBy'];
    const sortDir   = (url.searchParams.get('sortDir') ?? 'asc') as 'asc' | 'desc';
    const page      = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const pageSize  = Math.min(100, parseInt(url.searchParams.get('pageSize') ?? '10', 10));

    let results: User[] = [...mockUsers];

    // --- Filter ---
    if (accountId) {
      results = results.filter((u) => u.accountId === accountId);
    }
    if (search) {
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }
    if (role) {
      results = results.filter((u) => u.role === role);
    }
    if (status) {
      results = results.filter((u) => u.status === status);
    }

    // --- Sort ---
    if (sortBy) {
      results.sort((a, b) => {
        const aVal = a[sortBy] ?? '';
        const bVal = b[sortBy] ?? '';
        const cmp  = String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    // --- Paginate ---
    const total      = results.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage   = Math.min(page, totalPages);
    const start      = (safePage - 1) * pageSize;
    const data       = results.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      total,
      page: safePage,
      pageSize,
      totalPages,
    });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);

    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as CreateUserPayload;

    if (!body.name || !body.email || !body.role || !body.accountId) {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const emailTaken = mockUsers.some((u) => u.email === body.email);
    if (emailTaken) {
      return HttpResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role,
      status: 'pending',
      accountId: body.accountId,
      dateJoined: now,
      lastActive: now,
      twoFactorEnabled: false,
    };

    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const index = mockUsers.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json() as UpdateUserPayload;

    if (body.email) {
      const emailTaken = mockUsers.some(
        (u) => u.email === body.email && u.id !== params.id,
      );
      if (emailTaken) {
        return HttpResponse.json({ message: 'Email already in use' }, { status: 409 });
      }
    }

    const updated: User = { ...mockUsers[index], ...body };
    mockUsers[index] = updated;

    return HttpResponse.json(updated);
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const index = mockUsers.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    mockUsers.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
