import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router";
import { useTheme } from "@/lib/theme";

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  accounts: "Accounts",
  roles: "Roles",
  activity: "Activity",
  settings: "Settings",
};

// Turns a path like /users/abc123 into breadcrumb segments
function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const isId = !segmentLabels[seg]; // segment not in known labels → it's a dynamic id
    const label = isId
      ? segments[i - 1] === "users"
        ? "User Detail"
        : segments[i - 1] === "accounts"
          ? "Account Detail"
          : "Detail"
      : segmentLabels[seg];
    return { label, path, isId };
  });

  return crumbs;
}

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "user" | "account" | "role";
};

const initialNotifications: Notification[] = [
  { id: 1, title: "New user registered", description: "sarah.k@example.com joined as Viewer", time: "2m ago", read: false, type: "user" },
  { id: 2, title: "Account suspended", description: "Acme Corp account was suspended", time: "1h ago", read: false, type: "account" },
  { id: 3, title: "Role updated", description: "Manager permissions were changed", time: "3h ago", read: false, type: "role" },
  { id: 4, title: "User deleted", description: "john.doe@example.com was removed", time: "5h ago", read: true, type: "user" },
];

const typeColors: Record<Notification["type"], string> = {
  user: "bg-indigo-500",
  account: "bg-amber-500",
  role: "bg-emerald-500",
};

interface TopbarProps {
  onMobileMenuClick: () => void;
  onSearchClick: () => void;
}

export default function Topbar({ onMobileMenuClick, onSearchClick }: TopbarProps) {
  const { pathname } = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { resolvedTheme, toggleTheme } = useTheme();

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const crumbs = buildBreadcrumbs(pathname);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const darkMode = resolvedTheme === "dark";

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 relative">
      {/* left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
          onClick={onMobileMenuClick}
        >
          Menu
        </button>

        <nav className="flex items-center gap-1 text-sm">
          <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Home
          </Link>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={crumb.path} className="flex items-center gap-1">
                <span className="text-gray-300 dark:text-gray-600">/</span>
                {isLast ? (
                  <span className="text-gray-800 dark:text-gray-100 font-medium">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* right: actions */}
      <div className="flex items-center gap-4">
        {/* search */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 transition-colors hover:border-gray-300 dark:hover:border-gray-600"
        >
          <span>Search</span>
          <kbd className="font-sans text-xs bg-gray-100 dark:bg-gray-800 rounded px-1">⌘K</kbd>
        </button>

        {/* notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setUserMenuOpen(false); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Notifications"
          >
            {/* bell icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* items */}
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${n.read ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" : "bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"}`}
                  >
                    <div className="mt-1.5 shrink-0">
                      <span className={`block w-2 h-2 rounded-full ${n.read ? "bg-gray-300 dark:bg-gray-600" : typeColors[n.type]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-gray-100 font-medium"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{n.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">{n.time}</span>
                  </li>
                ))}
              </ul>

              {/* footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
                <Link
                  to="/activity"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* dark mode toggle */}
        <button
          onClick={toggleTheme}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? (
            // sun icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            // moon icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* user avatar menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => { setUserMenuOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              AE
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Ali</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-11 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* user info header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  AE
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">Ali Etebari</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">ali@adminix.io</p>
                </div>
              </div>

              {/* menu items */}
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Settings
                </Link>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
