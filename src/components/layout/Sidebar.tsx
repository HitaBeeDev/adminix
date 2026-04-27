import { NavLink, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { logout as logoutRequest } from "@/api/auth";

const links = [
  { to: "/dashboard", label: "Dashboard", short: "DB" },
  { to: "/users", label: "Users", short: "US" },
  { to: "/accounts", label: "Accounts", short: "AC" },
  { to: "/roles", label: "Roles", short: "RO" },
  { to: "/activity", label: "Activity", short: "AV" },
  { to: "/reports",  label: "Reports",  short: "RP" },
  { to: "/settings", label: "Settings", short: "ST" },
];

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileOpen);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const userName = user?.name ?? "Admin User";
  const userRole = user?.role.replace(/_/g, " ") ?? "admin";
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logoutRequest().catch(() => undefined);
    logout();
    setMobileOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      {/* desktop sidebar */}
      <div
        className={`hidden md:flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-56"}`}
      >
        {/* header */}
        <div className="h-14 px-3 border-b border-gray-700 flex items-center justify-between shrink-0">
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="text-lg font-bold tracking-wide truncate hover:text-gray-300 transition-colors"
            >
              Adminix
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors shrink-0 ${collapsed ? "mx-auto" : "ml-auto"}`}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 p-2 flex flex-col gap-1 overflow-hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded text-sm transition-colors
                ${collapsed ? "justify-center px-0 py-2" : "px-3 py-2"}
                ${isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`
              }
            >
              {collapsed ? (
                <span className="text-xs font-semibold tracking-wider">{link.short}</span>
              ) : (
                link.label
              )}
            </NavLink>
          ))}
        </nav>

        {/* footer — user widget */}
        <div className="p-3 border-t border-gray-700 shrink-0">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                title={`${userName} - ${userRole}`}
                className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0"
              >
                {initials}
              </div>
              <button
                title="Logout"
                onClick={handleLogout}
                aria-label="Logout"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{userName}</div>
                <div className="text-xs text-gray-400 truncate capitalize">{userRole}</div>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-red-400 hover:text-red-300 transition-colors shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* mobile sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-56 bg-gray-900 text-white z-30 flex flex-col transition-transform duration-200 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <span className="text-xl font-bold">Adminix</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="text-gray-400 hover:text-white text-sm"
          >
            X
          </button>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm ${isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{userName}</div>
              <div className="text-xs text-gray-400 truncate capitalize">{userRole}</div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="text-red-400 hover:text-red-300 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
