export function UserGrowthLegend() {
  return (
    <div className="flex items-center gap-5 mb-3">
      <div className="flex items-center gap-2">
        <span className="w-6 h-[2px] rounded-full bg-[#6366f1] inline-block" />
        <span className="text-[0.7rem] text-[#64748b] font-medium dark:text-[#cbd5e1]">Current period</span>
      </div>
      <div className="flex items-center gap-2">
        <svg width="22" height="2" viewBox="0 0 22 2" fill="none">
          <line x1="0" y1="1" x2="22" y2="1" stroke="#c7d2fe" strokeWidth="2" strokeDasharray="5 3" />
        </svg>
        <span className="text-[0.7rem] text-[#94a3b8] font-medium dark:text-[#64748b]">Previous period</span>
      </div>
    </div>
  );
}
