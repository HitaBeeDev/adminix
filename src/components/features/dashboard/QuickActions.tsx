import { Link } from "react-router";
import { ArrowUpRight, FileText, Key, ScrollText, UserPlus } from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "Invite User",
    description: "Add a teammate",
    meta: "User access",
    icon: UserPlus,
    to: "/users",
    accent: "text-[#6366f1] bg-[#eef2ff] dark:bg-[#312e81]/35 dark:text-[#a5b4fc]",
    glow: "group-hover:bg-[#6366f1]",
  },
  {
    label: "Generate Report",
    description: "Build an export",
    meta: "Analytics",
    icon: FileText,
    to: "/reports",
    accent: "text-[#0ea5e9] bg-[#e0f2fe] dark:bg-[#0c4a6e]/35 dark:text-[#7dd3fc]",
    glow: "group-hover:bg-[#0ea5e9]",
  },
  {
    label: "Audit Log",
    description: "Review changes",
    meta: "Security",
    icon: ScrollText,
    to: "/activity",
    accent: "text-[#10b981] bg-[#ecfdf5] dark:bg-[#064e3b]/35 dark:text-[#6ee7b7]",
    glow: "group-hover:bg-[#10b981]",
  },
  {
    label: "API Keys",
    description: "Manage tokens",
    meta: "Developer",
    icon: Key,
    to: "/settings",
    accent: "text-[#f59e0b] bg-[#fffbeb] dark:bg-[#78350f]/35 dark:text-[#fbbf24]",
    glow: "group-hover:bg-[#f59e0b]",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {QUICK_ACTIONS.map(({ label, description, meta, icon: Icon, to, accent, glow }) => (
        <Link
          key={label}
          to={to}
          className="group relative flex min-h-[7rem] overflow-hidden rounded-[1.2rem] border border-[#e2e8f0] bg-white pt-3 pl-5 pr-5 pb-3 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c7d2fe] hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/35 dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none dark:hover:border-[#475569] dark:hover:bg-[#111827]"
        >
          <span
            aria-hidden="true"
            className={`absolute left-0 top-0 h-full w-1 bg-[#e2e8f0] transition-colors duration-200 dark:bg-[#1e293b] ${glow}`}
          />

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 pl-1">
            <div className="flex items-start justify-between gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${accent}`}>
                <Icon size={15} strokeWidth={1.7} />
              </span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] text-[#475569] transition-colors group-hover:border-[#c7d2fe] group-hover:bg-[#eef2ff] group-hover:text-[#6366f1] dark:border-[#334155] dark:bg-[#111827] dark:text-[#94a3b8] dark:group-hover:border-[#6366f1] dark:group-hover:bg-[#1e293b] dark:group-hover:text-[#a5b4fc]">
                <ArrowUpRight size={12} strokeWidth={1.8} />
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[0.78rem] font-[500] leading-5 text-[#0f172a] dark:text-white">
                {label}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="truncate text-[0.7rem] font-[400] leading-5 text-[#64748b] dark:text-[#94a3b8]">
                  {description}
                </p>
                <span className="shrink-0 rounded-full bg-[#f8fafc] px-2 py-0.5 text-[0.625rem] font-[500] text-[#64748b] dark:bg-[#1e293b] dark:text-[#cbd5e1]">
                  {meta}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
