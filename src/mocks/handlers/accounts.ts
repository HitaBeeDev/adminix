import { http, HttpResponse } from 'msw';
import { mockAccounts } from '@/mocks/seeds';
import type { Account, AccountFilters, CreateAccountPayload, UpdateAccountPayload } from '@/types/account';

export const accountsHandlers = [
  http.get('/api/accounts', ({ request }) => {
    const url = new URL(request.url);

    const search   = url.searchParams.get('search')?.toLowerCase() ?? '';
    const plan     = url.searchParams.get('plan') ?? '';
    const status   = url.searchParams.get('status') ?? '';
    const page     = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const pageSize = Math.min(100, parseInt(url.searchParams.get('pageSize') ?? '10', 10));

    let results: Account[] = [...mockAccounts];

    // --- Filter ---
    if (search) {
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          a.ownerEmail.toLowerCase().includes(search) ||
          a.domain?.toLowerCase().includes(search),
      );
    }
    if (plan) {
      results = results.filter((a) => a.plan === plan);
    }
    if (status) {
      results = results.filter((a) => a.status === status);
    }

    // --- Paginate ---
    const total      = results.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage   = Math.min(page, totalPages);
    const start      = (safePage - 1) * pageSize;
    const data       = results.slice(start, start + pageSize);

    return HttpResponse.json({ data, total, page: safePage, pageSize, totalPages });
  }),

  http.get('/api/accounts/:id', ({ params }) => {
    const account = mockAccounts.find((a) => a.id === params.id);

    if (!account) {
      return HttpResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return HttpResponse.json(account);
  }),

  http.post('/api/accounts', async ({ request }) => {
    const body = await request.json() as CreateAccountPayload;

    if (!body.name || !body.plan || !body.ownerId || !body.ownerName || !body.ownerEmail) {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name: body.name,
      plan: body.plan,
      status: 'active',
      ownerId: body.ownerId,
      ownerName: body.ownerName,
      ownerEmail: body.ownerEmail,
      membersCount: 1,
      createdDate: new Date().toISOString(),
      domain: body.domain,
    };

    mockAccounts.push(newAccount);

    return HttpResponse.json(newAccount, { status: 201 });
  }),

  http.put('/api/accounts/:id', async ({ params, request }) => {
    const index = mockAccounts.findIndex((a) => a.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    const body = await request.json() as UpdateAccountPayload;
    const updated: Account = { ...mockAccounts[index], ...body };
    mockAccounts[index] = updated;

    return HttpResponse.json(updated);
  }),
];
