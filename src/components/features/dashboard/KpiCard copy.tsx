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

export default function KpiCard({ label, value, description, trend, icon: Icon, iconClassName, to, loading }: KpiProps) {
  const animated = useCountUp(value);

  return (
    <div className="bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] p-6 transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between">
        <p className="text-[15px] font-semibold text-[#0f172a]">{label}</p>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${iconClassName}`}>
          <Icon size={16} />
        </div>
      </div>

      <div className="flex items-end gap-2.5 mt-5">
        {loading ? (
          <div className="h-8 w-20 rounded-md animate-pulse bg-[#f1f5f9]" />
        ) : (
          <>
            <span
              className="text-[38px] leading-none font-bold tracking-tight text-[#0f172a]"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {value !== undefined ? animated.toLocaleString() : "—"}
            </span>
            <span className={`mb-1 inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[12px] font-semibold ${trend.up ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fff1f2] text-[#f43f5e]"}`}>
              {trend.up ? "▲" : "▼"} {trend.pct}
            </span>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 text-[13px] leading-5 font-medium text-[#64748b]">{description}</p>
        <Link
          to={to}
          aria-label={`View ${label}`}
          className="h-9 w-9 rounded-full border border-[#e2e8f0] bg-[#ffffff] text-[#475569] flex items-center justify-center shrink-0 transition-colors duration-150 hover:border-[#c7d2fe] hover:bg-[#eef2ff] hover:text-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#c7d2fe]"
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
