import { useState } from "react";
import { useLocation, Link } from "react-router";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/accounts": "Accounts",
  "/roles": "Roles",
  "/activity": "Activity",
  "/settings": "Settings",
};

const mockNotifications = [
  { id: 1, text: "New user registered", time: "2m ago" },
  { id: 2, text: "Account suspended", time: "1h ago" },
  { id: 3, text: "Role updated", time: "3h ago" },
];

interface TopbarProps {
  onMobileMenuClick: () => void;
}

export default function Topbar({ onMobileMenuClick }: TopbarProps) {
  const { pathname } = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const pageLabel = routeLabels[pathname] ?? "Page";

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 relative">
      {/* left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-600 hover:text-gray-900 text-sm"
          onClick={onMobileMenuClick}
        >
          Menu
        </button>
        <span className="text-sm text-gray-500">
          <Link to="/dashboard" className="hover:underline">
            Home
          </Link>
          {pathname !== "/dashboard" && (
            <span> / {pageLabel}</span>
          )}
        </span>
      </div>

      {/* right: actions */}
      <div className="flex items-center gap-4">
        {/* search */}
        <button className="text-sm text-gray-600 hover:text-gray-900">
          Search (⌘K)
        </button>

        {/* notifications */}
        <div className="relative">
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
          >
            Notifications (3)
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-8 w-64 bg-white border border-gray-200 rounded shadow-lg z-50">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="text-sm text-gray-800">{n.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* dark mode */}
        <button
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={toggleDarkMode}
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* user menu */}
        <div className="relative">
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
          >
            Admin
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setUserMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setUserMenuOpen(false)}
              >
                Settings
              </Link>
              <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
