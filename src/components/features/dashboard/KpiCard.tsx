import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

export interface KpiProps {
  label: string;
  value: number | undefined;
  description: string;
  trend: { pct: string; up: boolean };
  icon: React.ElementType;
  iconClassName: string;
  to: string;
  loading: boolean;
}

export default function KpiCard({
  label,
  value,
  description,
  trend,
  icon: Icon,
  iconClassName,
  to,
  loading,
}: KpiProps) {
  const animated = useCountUp(value);

  return (
    <div
      className="bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] transition-all duration-200 pt-3 pl-5 pr-5 pb-3
    shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none"
    >
      <div className="flex flex-row items-center justify-between">
        <p className="text-[0.78rem] font-[500] text-[#0f172a] dark:text-white">{label}</p>

        <div
          className={`w-[2rem] h-[2rem] rounded-full flex items-center justify-center shrink-0 ${iconClassName}`}
        >
          <Icon size={15} strockwidth={1.35} />
        </div>
      </div>

      <div className="flex items-end gap-2.5 mt-2">
        {loading ? (
          <div className="h-7 w-20 rounded-full animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
        ) : (
          <>
            <span
              className="text-[2rem] leading-none font-[600] tracking-tight text-[#0f172a] dark:text-white"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {value !== undefined ? animated.toLocaleString() : "—"}
            </span>
            <span
              className={`mb-1 inline-flex items-center gap-1 h-6 px-[0.7rem] rounded-full text-[0.65rem] font-semibold ${trend.up ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fff1f2] text-[#f43f5e]"}`}
            >
              {trend.up ? "▲" : "▼"} {trend.pct}
            </span>
          </>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between">
        <p className="min-w-0 text-[0.7rem] leading-5 font-[400] text-[#64748b] dark:text-[#94a3b8]">
          {description}
        </p>
        <Link
          to={to}
          aria-label={`View ${label}`}
          className="h-6 w-6 rounded-full border border-[#e2e8f0] bg-[#ffffff] text-[#475569] flex items-center justify-center shrink-0 transition-colors duration-150 hover:border-[#c7d2fe] hover:bg-[#eef2ff] hover:text-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#c7d2fe] dark:border-[#334155] dark:bg-[#111827] dark:text-[#94a3b8] dark:hover:border-[#6366f1] dark:hover:bg-[#1e293b] dark:hover:text-[#a5b4fc]"
        >
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
