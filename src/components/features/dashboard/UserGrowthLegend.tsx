export function UserGrowthLegend() {
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="flex items-center gap-1.5">
        <span className="w-5 h-[2.5px] rounded-full bg-[#6366f1] inline-block" />
        <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-[#64748b] dark:text-[#94a3b8]">
          Current
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <svg width="20" height="3" viewBox="0 0 20 3" fill="none">
          <line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#c7d2fe" strokeWidth="2" strokeDasharray="5 3" />
        </svg>
        <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-[#94a3b8] dark:text-[#475569]">
          Previous
        </span>
      </div>
    </div>
  );
}
