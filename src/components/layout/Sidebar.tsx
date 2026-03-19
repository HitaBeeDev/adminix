import { NavLink } from "react-router";

const links = [
  { to: "/dashboard", label: "Dashboard", short: "Da" },
  { to: "/users", label: "Users", short: "Us" },
  { to: "/accounts", label: "Accounts", short: "Ac" },
  { to: "/roles", label: "Roles", short: "Ro" },
  { to: "/activity", label: "Activity", short: "Ac" },
  { to: "/settings", label: "Settings", short: "Se" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  return (
    <>
      {/* desktop sidebar */}
      <div
        className={`hidden md:flex flex-col h-screen bg-gray-900 text-white transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {!collapsed && <span className="text-xl font-bold">Adminix</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white text-sm ml-auto"
          >
            {collapsed ? ">>" : "<<"}
          </button>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm ${isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`
              }
            >
              {collapsed ? link.short : link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          {!collapsed && (
            <div className="text-sm text-gray-400 mb-2">Admin User</div>
          )}
          <button className="text-sm text-red-400 hover:text-red-300">
            {collapsed ? "Lo" : "Logout"}
          </button>
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

        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Admin User</div>
          <button className="text-sm text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
