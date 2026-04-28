import type { ElementType } from "react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: ElementType;
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function SidebarNavItem({
  to,
  label,
  icon: Icon,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center h-10 rounded-[0.45rem] transition-colors duration-150 select-none text-[0.7rem]",
          collapsed
            ? "justify-center w-8 h-8 p-[0.3rem] mx-auto"
            : "gap-[0.6rem] px-4",
          isActive
            ? "bg-[#eef2ff] text-[#0f172a] font-[400] text-[0.7rem]"
            : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] font-[300] text-[0.7rem]",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            strokeWidth={1.35}
            size={18}
            className={cn(
              "shrink-0",
              isActive
                ? "text-[#6366f1]"
                : "text-[#94a3b8] group-hover:text-[#6366f1]",
            )}
          />
          {!collapsed && <span className="text-[0.85rem]">{label}</span>}
        </>
      )}
    </NavLink>
  );
}
