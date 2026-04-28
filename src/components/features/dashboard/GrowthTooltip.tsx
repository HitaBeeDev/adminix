export default function GrowthTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="text-[0.6875rem] font-semibold px-2.5 py-1 rounded-md bg-[#6366f1] text-white shadow-[0_4px_12px_-4px_rgba(99,102,241,0.4)]">
      {payload[0].value.toLocaleString()}
    </div>
  );
}
