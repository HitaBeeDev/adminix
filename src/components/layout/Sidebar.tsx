import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Blocks, ChevronLeft } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileOpen);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setCollapsed(!mql.matches);
    const handler = (e: MediaQueryListEvent) => setCollapsed(!e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [setCollapsed]);

  async function handleLogout() {
    await logout.mutateAsync();
    setMobileOpen(false);
    navigate("/login", { replace: true });
  }

  const contentProps = { onLogout: handleLogout };

  return (
    <div>
      <aside
        className={cn(
          "my-5 ml-5 mr-0.5 hidden h-[calc(100vh_-_40px)] shrink-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#e2e8f0] bg-[#ffffff] shadow-[0_24px_70px_-52px_rgba(15,23,42,0.12)] transition-[width] duration-200 ease-out md:flex",
          collapsed ? "w-[84px]" : "w-[270px]",
        )}
      >
        <SidebarContent
          {...contentProps}
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Mobile overlay drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen z-30 md:hidden transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <aside className="flex flex-col bg-[#ffffff] border-r border-[#e2e8f0] w-72 h-full">
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-[#e2e8f0] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#6366f1] flex items-center justify-center">
                <Blocks size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f172a]">
                Adminix
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <SidebarContent
              {...contentProps}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
