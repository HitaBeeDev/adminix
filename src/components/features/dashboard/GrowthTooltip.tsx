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
  return (
    <div className="rounded-xl bg-[#0f172a] text-white shadow-2xl border border-[#1e293b] px-3.5 py-2.5 text-[0.6875rem] min-w-[140px]">
      <p className="font-semibold mb-2 text-[#475569] uppercase tracking-widest text-[0.575rem]">{label}</p>
      {current && (
        <div className="flex items-center justify-between gap-6 mb-1.5">
          <span className="flex items-center gap-1.5 text-[#a5b4fc]">
            <span className="w-2.5 h-0.5 rounded-full bg-[#6366f1] inline-block" />
            Current
          </span>
          <span className="font-bold text-white">{current.value.toLocaleString()}</span>
        </div>
      )}
      {previous && (
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-[#475569]">
            <span className="w-2.5 h-0.5 rounded-full bg-[#475569] inline-block" />
            Prev.
          </span>
          <span className="font-medium text-[#64748b]">{previous.value.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
