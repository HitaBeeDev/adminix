import { useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  accounts: "Accounts",
  roles: "Roles",
  activity: "Activity",
  reports: "Reports",
  settings: "Settings",
};

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const label = SEGMENT_LABELS[seg]
      ? SEGMENT_LABELS[seg]
      : segments[i - 1] === "users"
        ? "User Detail"
        : segments[i - 1] === "accounts"
          ? "Account Detail"
          : "Detail";
    return { label, path };
  });
}

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New user registered", description: "sarah.k@example.com joined as Viewer", time: "2m ago", read: false },
  { id: 2, title: "Account suspended", description: "Acme Corp account was suspended", time: "1h ago", read: false },
  { id: 3, title: "Role updated", description: "Manager permissions were changed", time: "3h ago", read: false },
  { id: 4, title: "User deleted", description: "john.doe@example.com was removed", time: "5h ago", read: true },
];

export default function Topbar() {
  const { pathname } = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const setMobileOpen = useUiStore((s) => s.setMobileOpen);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;
  const crumbs = buildBreadcrumbs(pathname);
  const isDark = resolvedTheme === "dark";
  const userName = user?.name ?? "Admin User";
  const userRole = user?.role.replace(/_/g, " ") ?? "admin";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    await logout.mutateAsync();
    setUserMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="min-h-[88px] bg-transparent flex items-center justify-between gap-4 px-5 pt-5 sm:px-7 lg:px-8 shrink-0">
      {/* Left: mobile menu + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-[#ffffff] text-[#2e2e2e]/70 shadow-[0_16px_34px_-28px_#181818] hover:bg-[#4fc4cf]/10 hover:text-[#181818] transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-sm rounded-full bg-[#ffffff]/45 px-4 py-2 border border-[#181818]/5">
          <Link
            to="/dashboard"
            className="text-[#2e2e2e]/60 transition-colors"
          >
            Workspace
          </Link>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={crumb.path} className="flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className="text-xs text-[#2e2e2e]/30"
                >
                  /
                </span>
                {isLast ? (
                  <span className="font-medium text-[#181818]">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-[#2e2e2e]/60 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        {/* Search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open search"
          className="hidden h-14 w-[min(460px,42vw)] items-center gap-3 rounded-full border border-[#181818]/6 bg-[#ffffff] px-5 text-sm shadow-[0_18px_48px_-38px_#181818] transition-colors hover:border-[#4fc4cf]/25 sm:flex"
        >
          <Search size={18} className="shrink-0 text-[#2e2e2e]/65" />
          <span className="flex-1 text-left text-[14px] text-[#2e2e2e]/62">
            Search users, accounts, reports...
          </span>
          <kbd className="text-[11px] font-semibold px-2 py-1 rounded-full bg-[#4fc4cf]/12 text-[#2e2e2e]/70">
            ⌘K
          </kbd>
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setUserMenuOpen(false); }}
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
            aria-expanded={notifOpen}
            className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#ffffff] text-[#2e2e2e]/70 hover:bg-[#4fc4cf]/10 hover:text-[#181818] transition-colors focus-visible:outline-none shadow-[0_16px_34px_-28px_#181818]"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#994ff3] ring-2 ring-[#ffffff]" />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-14 w-80 bg-[#ffffff] rounded-3xl border border-[#181818]/8 z-50 overflow-hidden shadow-[0_24px_70px_-45px_rgba(24,24,24,0.35)]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#181818]/8">
                <span className="text-sm font-semibold text-[#181818]">Notifications</span>
                {unread > 0 && (
                  <button
                    onClick={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))}
                    className="text-xs text-[#4fc4cf] hover:underline transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-[#181818]/8">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => setNotifications((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                      className="w-full flex gap-3 px-4 py-3 text-left hover:bg-[#4fc4cf]/10 transition-colors"
                    >
                      <div className="mt-2 shrink-0">
                        <span className={`block w-1.5 h-1.5 rounded-full ${n.read ? "bg-[#181818]/20" : "bg-[#4fc4cf]"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${n.read ? "text-[#2e2e2e]/70" : "text-[#181818] font-medium"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs mt-0.5 truncate text-[#2e2e2e]/60">
                          {n.description}
                        </p>
                      </div>
                      <span className="text-xs shrink-0 mt-0.5 text-[#2e2e2e]/60">
                        {n.time}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 border-t border-[#181818]/8">
                <Link
                  to="/activity"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-[#4fc4cf] hover:underline transition-colors"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ffffff] text-[#2e2e2e]/70 hover:bg-[#4fc4cf]/10 hover:text-[#181818] transition-colors focus-visible:outline-none shadow-[0_16px_34px_-28px_#181818]"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User chip */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserMenuOpen((o) => !o); setNotifOpen(false); }}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#4fc4cf]/10 transition-colors focus-visible:outline-none shadow-[0_16px_34px_-28px_#181818]"
          >
            <img
              src="/p1.jpg"
              alt={userName}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[#4fc4cf]/15"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-semibold text-[#181818]">{userName}</p>
              <p className="text-[11px] capitalize text-[#2e2e2e]/65">
                {userRole}
              </p>
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-14 w-60 bg-[#ffffff] rounded-3xl border border-[#181818]/8 z-50 overflow-hidden p-2 shadow-[0_24px_70px_-45px_rgba(24,24,24,0.35)]"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[#181818]/8 mb-1">
                <img
                  src="/p1.jpg"
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-[#4fc4cf]/15"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#181818] truncate">{userName}</p>
                  <p className="text-[11px] truncate capitalize text-[#2e2e2e]/60">
                    {userRole}
                  </p>
                </div>
              </div>
              <Link
                to="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm text-[#2e2e2e] hover:bg-[#4fc4cf]/10 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm text-[#2e2e2e] hover:bg-[#4fc4cf]/10 transition-colors"
              >
                Settings
              </Link>
              <div className="my-1 h-px bg-[#181818]/8" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm text-[#994ff3] hover:bg-[#994ff3]/10 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
