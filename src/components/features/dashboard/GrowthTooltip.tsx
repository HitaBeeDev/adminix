export default function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const current = payload.find((p) => p.dataKey === "current");
  const previous = payload.find((p) => p.dataKey === "previous");

  const delta =
    current && previous && previous.value > 0
      ? (((current.value - previous.value) / previous.value) * 100).toFixed(1)
      : null;
  const isUp = delta ? parseFloat(delta) >= 0 : true;

  return (
    <div className="rounded-xl bg-[#0f172a] text-white shadow-2xl border border-white/[0.06] px-3 py-2.5 min-w-[148px]">
      <p className="text-[0.6rem] font-semibold text-[#475569] uppercase tracking-widest mb-2">
        {label}
      </p>

      {current && (
        <div className="flex items-center justify-between gap-8 mb-1.5">
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-[#a5b4fc]">
            <span className="w-2.5 h-[2px] rounded-full bg-[#6366f1] inline-block" />
            Current
          </span>
          <span className="text-[0.875rem] font-bold text-white tabular-nums">
            {current.value.toLocaleString()}
          </span>
        </div>
      )}

      {previous && (
        <div className="flex items-center justify-between gap-8">
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-[#475569]">
            <svg width="10" height="2" viewBox="0 0 10 2">
              <line x1="0" y1="1" x2="10" y2="1" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            Prev.
          </span>
          <span className="text-[0.8125rem] font-medium text-[#64748b] tabular-nums">
            {previous.value.toLocaleString()}
          </span>
        </div>
      )}

      {delta && (
        <div
          className={`mt-2 pt-2 border-t border-white/[0.06] text-[0.625rem] font-bold tabular-nums ${isUp ? "text-[#34d399]" : "text-[#f87171]"}`}
        >
          {isUp ? "▲" : "▼"} {Math.abs(parseFloat(delta))}% vs prev.
        </div>
      )}
    </div>
  );
}
