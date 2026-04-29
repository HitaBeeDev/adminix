# Adminix

An internal admin dashboard for a fictional SaaS platform — the kind of tool an ops or support team would use to manage customer accounts, users, roles, and activity logs. Built as a portfolio project to demonstrate senior-level frontend patterns: real data flows, thoughtful state architecture, and the kind of edge cases that only show up when you actually build the thing.

**Live demo:** _[deploy URL here]_

---

![Adminix demo](docs/demo.gif)
_Login → dashboard → filter users → invite → optimistic status toggle_

---

## What it does

Adminix has 10 mock customer companies and 100,000 users spread across them. The person using this dashboard is an internal Adminix employee — not a customer. They can search and filter the full user list, invite new users with a role and account assignment, suspend or delete users in bulk, read a global audit log, view per-account member lists, and pull reports. Everything is client-side; there's no real backend. MSW intercepts all fetch calls and responds from in-memory seed data.

---

## Stack

| Technology | Why |
|---|---|
| React 19 + TypeScript | Baseline. Strict mode catches subtle bugs early. |
| Vite | Fast dev server, native ESM, minimal config overhead. |
| Tailwind CSS v4 | Utility-first makes dark mode and one-off layout adjustments cheap. `class` strategy so the dark toggle is just a classList swap. |
| shadcn/ui | Accessible primitives without a component library lock-in. Copy-paste, own the code. |
| TanStack Query | Handles loading/error/stale states without boilerplate. `placeholderData` keeps the previous page visible during pagination so the layout doesn't jump. |
| Zustand | Auth state and UI state (sidebar collapsed, command palette open, theme) live here. Lightweight, no context provider wrapping. |
| React Hook Form + Zod | Zod schema is the single source of truth — form types, validation, and error messages all come from one object. |
| MSW | Intercepts at the Service Worker level, so the network tab shows real requests. Handlers live in `src/mocks/` and are never bundled into production. |
| React Router v6 | Nested routes and `useSearchParams` for URL-as-state on the users page. |
| Recharts | Good enough for dashboard charts; no need for D3 at this scale. |
| @tanstack/react-virtual | Renders only visible rows for the 100k user list. |
| Playwright | E2E tests against a real browser hitting the real dev server. |
| Vitest | Unit and integration tests for hooks, utilities, and key component flows. |

---

## Running locally

```bash
npm install
npm run dev        # starts Vite + MSW service worker
npm test           # Vitest unit + integration tests
npm run test:e2e   # Playwright E2E (starts dev server automatically)
npm run build      # tsc + vite build
```

The app runs at `http://localhost:5173`. Log in with any email and the password `password`.

---

## Folder structure

```
src/
├── api/          # Plain fetch functions — one file per resource, no framework coupling
├── components/
│   ├── features/ # Domain components (InviteUserModal, RoleMatrix, etc.)
│   ├── layout/   # AppShell, Sidebar, Topbar, ProtectedRoute, CommandPalette
│   └── ui/       # Base components: Button, Modal, Badge, Skeleton, Toast, etc.
├── hooks/        # React Query wrappers (useUsers, useDashboard) + utility hooks
├── lib/          # cn(), theme utilities, error helpers
├── mocks/
│   ├── handlers/ # MSW route handlers — users, accounts, roles, auth, activity
│   └── seeds/    # In-memory seed data: 50 real users, 10 accounts, 5 roles, 200 events
├── pages/        # One directory per route; large pages are split into sub-components
├── stores/       # Zustand: authStore, uiStore, toastStore
└── types/        # Shared interfaces — User, Account, Role, ActivityEvent, AuthUser
e2e/              # Playwright tests: login, search, invite, dark mode, nav
```

---

## Data flow

```
MSW (Service Worker)
  └─ intercepts fetch()
       └─ returns mock JSON
            └─ API layer (src/api/)
                 └─ called by React Query hooks (src/hooks/)
                      └─ data lands in components via useQuery/useMutation
                           ├─ server state cached by React Query
                           └─ UI state (sidebar, modals, theme) in Zustand
```

Mutations follow the same path upward: component calls `mutateAsync`, hook fires the API function, MSW intercepts and updates its in-memory state, React Query invalidates the relevant cache keys, and the UI re-fetches automatically.

---

## Auth flow

1. Login form submits to `POST /api/auth/login`. MSW checks that the password equals `"password"` and returns `{ user, token }`.
2. The `useLogin` hook's `onSuccess` calls `authStore.login(user, token, rememberMe)`.
3. Zustand's persist middleware writes to `localStorage` if "remember me" was checked, otherwise `sessionStorage`. The decision is made at write time — a custom `adaptiveStorage` object checks a separate `adminix-remember-me` flag before routing the write.
4. On every app load, Zustand rehydrates from whichever storage has the key. `ProtectedRoute` reads `isAuthenticated` and redirects to `/login` if it's false.
5. The token is stored in the Zustand state and would attach to outgoing requests via an `Authorization: Bearer` header in a real app. In this demo, MSW doesn't validate the header — the auth check is client-side only.

---

## Key engineering decisions

**Decision 1: Virtual scrolling for the 100k user list**

The problem: paginating 100,000 users is realistic for a SaaS admin tool. A simple pagination approach works fine at 50 users per page but you lose the ability to scroll continuously and the UX feels sluggish on fast filter changes.

Options considered:
- Pure pagination with page numbers (simple, predictable, no DOM overhead)
- Infinite scroll + React Query's `useInfiniteQuery` (smooth, but complex cache invalidation)
- Virtual scrolling with `@tanstack/react-virtual` (renders only visible rows, scales to any size)

Choice: virtual scrolling. The MSW handler generates users deterministically from a seeded random function — user #50,000 is always the same person regardless of when you call it — so the list is stable enough for a virtualizer. The tradeoff is that bulk selection across pages needs careful state management (we track selected IDs, not selected rows).

---

**Decision 2: URL as state for filters and pagination**

The problem: filter state that lives in `useState` disappears on refresh, breaks the back button, and can't be shared by URL.

Options considered:
- `useState` per filter (simple but ephemeral)
- Global store in Zustand (persistent but couples UI state to a store)
- URL search params via `useSearchParams` (persistent, shareable, no extra state)

Choice: URL params. The search input, role filter, status filter, sort column, sort direction, page, and page size all live in the URL. A custom `useSearchParamState` hook wraps `useSearchParams` and removes a param from the URL when it equals its default value, so the URL stays clean. The one tradeoff: the debounce for search input is still `useState` (typing into a URL on every keystroke would cause too many navigations), so there's a brief window where the input and URL are out of sync.

---

**Decision 3: React Query's optimistic update pattern for user edits**

The problem: status toggles on the user detail page should feel instant. Waiting for the round-trip to show the new value makes the UI feel laggy.

Options considered:
- Wait for the API response, then update (simple, always correct, but slow)
- Optimistic update with full rollback (instant UI, complexity in the error path)
- Optimistic update without rollback (instant UI, but wrong state on error)

Choice: optimistic update with rollback via `onMutate`/`onError` in `useUpdateUser`. Before the mutation fires, we snapshot the current cache entry, apply the update immediately, and return the snapshot as context. If the mutation fails, `onError` restores the snapshot. `onSettled` always invalidates the query so any discrepancy between optimistic state and server truth gets resolved. The tradeoff: if two updates fire in quick succession, the second one's optimistic snapshot may contain the first one's optimistic state rather than server truth — a known limitation of this pattern at the cache level.

---

## If I had more time

**Real error boundaries per section.** Right now an uncaught error in one widget can take down the whole page. Adding a boundary around each dashboard card, each table, and each modal — with a "retry" action that resets it — would make the app feel significantly more production-grade.

**A proper `usePermission` hook.** Role-based visibility is scattered across components as ad-hoc checks. A single `usePermission('delete:user')` hook that consults the auth store and a permissions map would centralize the logic and make it easy to audit what each role can do.

**Keyboard navigation on the data table.** The command palette works, but once you're on the users page there's no way to navigate rows, toggle selection, or open the action menu without a mouse. For an internal tool used all day by ops teams, that matters.

---

## Notes on production gaps

**Security:** auth is enforced client-side only for this demo. In production, every API request would carry `Authorization: Bearer <token>`, and the server would validate it on every route. The client-side check in `ProtectedRoute` is just UX — it's not a security boundary.

**Error monitoring:** the architecture is set up for Sentry — a boundary component can capture exceptions with user action context (which page, which user ID was being edited, what filters were active). That breadcrumb trail is what makes a Sentry alert actually actionable. Not wired up in this repo since there's no production environment to send events to.
