import { http, HttpResponse } from 'msw';
import { mockUsers } from '@/mocks/seeds';
import type { User, UserFilters, CreateUserPayload, UpdateUserPayload } from '@/types/user';

const GENERATED_USER_TARGET = 100_000;
const GENERATED_SEED = 42_019;
const GENERATED_FIRST_NAMES = [
  'Avery', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Quinn', 'Rowan',
  'Skyler', 'Cameron', 'Reese', 'Parker', 'Drew', 'Hayden', 'Emerson', 'Finley',
] as const;
const GENERATED_LAST_NAMES = [
  'Stone', 'Rivera', 'Chen', 'Patel', 'Bennett', 'Hayes', 'Kim', 'Nguyen',
  'Carter', 'Singh', 'Brooks', 'Reed', 'Foster', 'Cruz', 'Walsh', 'Nair',
] as const;
const GENERATED_ROLES: User['role'][] = ['admin', 'manager', 'editor', 'viewer', 'guest'];
const GENERATED_STATUSES: User['status'][] = ['active', 'active', 'active', 'pending', 'suspended'];

const createdUsers: User[] = [];
const userOverrides = new Map<string, UpdateUserPayload>();
const deletedUserIds = new Set<string>();

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value += 0x6D2B79F5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function generatedUserId(index: number) {
  return `usr_${String(index).padStart(6, '0')}`;
}

function generatedUserIndex(id: string) {
  const match = /^usr_(\d{6})$/.exec(id);
  if (!match) return null;

  const index = Number(match[1]);
  return index > mockUsers.length && index <= GENERATED_USER_TARGET ? index : null;
}

function makeGeneratedUser(index: number): User {
  const random = seededRandom(GENERATED_SEED + index);
  const firstName = GENERATED_FIRST_NAMES[Math.floor(random() * GENERATED_FIRST_NAMES.length)];
  const lastName = GENERATED_LAST_NAMES[Math.floor(random() * GENERATED_LAST_NAMES.length)];
  const role = GENERATED_ROLES[Math.floor(random() * GENERATED_ROLES.length)];
  const status = GENERATED_STATUSES[Math.floor(random() * GENERATED_STATUSES.length)];
  const accountNumber = Math.floor(random() * 10) + 1;
  const joinedYear = 2021 + Math.floor(random() * 5);
  const joinedMonth = Math.floor(random() * 12);
  const joinedDay = Math.floor(random() * 28) + 1;
  const activeDayOffset = Math.floor(random() * 180);
  const id = generatedUserId(index);
  const user: User = {
    id,
    name: `${firstName} ${lastName} ${index}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index}@example.adminix.dev`,
    role,
    status,
    avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
    lastActive: new Date(Date.UTC(2026, 3, 8 - activeDayOffset, 9, index % 60, 0)).toISOString(),
    dateJoined: new Date(Date.UTC(joinedYear, joinedMonth, joinedDay, 9, 0, 0)).toISOString(),
    lastIp: `10.${accountNumber}.${Math.floor(index / 255) % 255}.${index % 255}`,
    twoFactorEnabled: random() > 0.55,
    accountId: `acc_${String(accountNumber).padStart(2, '0')}`,
  };

  return { ...user, ...userOverrides.get(id) };
}

function getSeedUsers(): User[] {
  return mockUsers
    .filter((user) => !deletedUserIds.has(user.id))
    .map((user) => ({ ...user, ...userOverrides.get(user.id) }));
}

function getGeneratedUsers(): User[] {
  return Array.from(
    { length: GENERATED_USER_TARGET - mockUsers.length },
    (_, offset) => makeGeneratedUser(mockUsers.length + offset + 1),
  ).filter((user) => !deletedUserIds.has(user.id));
}

function getAllUsers() {
  return [...getSeedUsers(), ...getGeneratedUsers(), ...createdUsers];
}

function getUserById(id: string) {
  const createdUser = createdUsers.find((user) => user.id === id);
  if (createdUser) return createdUser;

  const seedUser = mockUsers.find((user) => user.id === id);
  if (seedUser && !deletedUserIds.has(id)) return { ...seedUser, ...userOverrides.get(id) };

  const generatedIndex = generatedUserIndex(id);
  if (generatedIndex && !deletedUserIds.has(id)) return makeGeneratedUser(generatedIndex);

  return null;
}

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
    const pageSize  = Math.min(100_000, parseInt(url.searchParams.get('pageSize') ?? '10', 10));

    let results: User[] = getAllUsers();

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
    const id = String(params.id);
    const user = getUserById(id);

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

    const emailTaken = getAllUsers().some((u) => u.email === body.email);
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

    createdUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const id = String(params.id);
    const existing = getUserById(id);

    if (!existing) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json() as UpdateUserPayload;

    if (body.email) {
      const emailTaken = getAllUsers().some(
        (u) => u.email === body.email && u.id !== id,
      );
      if (emailTaken) {
        return HttpResponse.json({ message: 'Email already in use' }, { status: 409 });
      }
    }

    const updated: User = { ...existing, ...body };
    const createdIndex = createdUsers.findIndex((u) => u.id === id);
    if (createdIndex >= 0) {
      createdUsers[createdIndex] = updated;
    } else {
      userOverrides.set(id, body);
    }

    return HttpResponse.json(updated);
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const id = String(params.id);
    const createdIndex = createdUsers.findIndex((u) => u.id === id);
    const existing = getUserById(id);

    if (!existing) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (createdIndex >= 0) {
      createdUsers.splice(createdIndex, 1);
    } else {
      deletedUserIds.add(id);
      userOverrides.delete(id);
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
