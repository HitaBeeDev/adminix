import { http, HttpResponse } from 'msw';
import { mockActivity } from '@/mocks/seeds';

export const activityHandlers = [
  http.get('/api/activity', ({ request }) => {
    const url = new URL(request.url);

    const userId     = url.searchParams.get('userId') ?? '';
    const actionType = url.searchParams.get('actionType') ?? '';
    const dateFrom   = url.searchParams.get('dateFrom') ?? '';
    const dateTo     = url.searchParams.get('dateTo') ?? '';
    const page       = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const pageSize   = Math.min(100, parseInt(url.searchParams.get('pageSize') ?? '20', 10));

    let results = [...mockActivity];

    // --- Filter ---
    if (userId) {
      results = results.filter((e) => e.actorId === userId);
    }
    if (actionType) {
      results = results.filter((e) => e.action === actionType);
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      results = results.filter((e) => new Date(e.timestamp).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      const endOfDay = new Date(to);
      endOfDay.setUTCHours(23, 59, 59, 999);
      results = results.filter((e) => new Date(e.timestamp).getTime() <= endOfDay.getTime());
    }

    // --- Sort: newest first ---
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // --- Paginate ---
    const total      = results.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage   = Math.min(page, totalPages);
    const start      = (safePage - 1) * pageSize;
    const data       = results.slice(start, start + pageSize);

    return HttpResponse.json({ data, total, page: safePage, pageSize, totalPages });
  }),
];
