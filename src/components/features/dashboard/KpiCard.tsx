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
      className="mt-3 bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] transition-all duration-200 pt-3 pl-5 pr-5 pb-3
    shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]"
    >
      <div className="flex flex-row items-center justify-between">
        <p className="text-[0.78rem] font-[500] text-[#0f172a]">{label}</p>

        <div
          className={`w-[2rem] h-[2rem] rounded-full flex items-center justify-center shrink-0 ${iconClassName}`}
        >
          <Icon size={15} strockwidth={1.35} />
        </div>
      </div>

      <div className="flex items-end gap-2.5 mt-2">
        {loading ? (
          <div className="h-7 w-20 rounded-full animate-pulse bg-[#f1f5f9]" />
        ) : (
          <>
            <span
              className="text-[2rem] leading-none font-[600] tracking-tight text-[#0f172a]"
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
    </div>
  );
}
