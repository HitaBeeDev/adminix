import { Link } from "react-router";
import { UserPlus, FileText, ScrollText, Key } from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Invite User",     icon: UserPlus,   to: "/users" },
  { label: "Generate Report", icon: FileText,   to: "/reports" },
  { label: "Audit Log",       icon: ScrollText, to: "/activity" },
  { label: "API Keys",        icon: Key,        to: "/settings" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
        <Link
          key={label}
          to={to}
          className="flex flex-col justify-between h-24 bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] pt-3 pl-5 pr-5 pb-3 cursor-pointer transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:bg-[#fafbff] hover:border-[#6366f1]/25 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]"
        >
          <Icon size={18} className="text-[#94a3b8]" />
          <span className="text-[0.78rem] font-[500] text-[#0f172a]">{label}</span>
        </Link>
      ))}
    </div>
  );
}
