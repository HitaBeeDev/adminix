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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
        <Link
          key={label}
          to={to}
          className="flex flex-col justify-between h-28 bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-5 cursor-pointer transition-all duration-200 shadow-[0_22px_60px_-54px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:bg-[#fafbff] hover:border-[#6366f1]/25 hover:shadow-[0_28px_70px_-52px_rgba(99,102,241,0.15)]"
        >
          <Icon size={20} className="text-[#94a3b8]" />
          <span className="text-sm font-medium text-[#0f172a]">{label}</span>
        </Link>
      ))}
    </div>
  );
}
