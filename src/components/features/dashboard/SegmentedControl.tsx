export default function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#f1f5f9] dark:bg-[#1e293b]">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`h-8 px-4 text-xs font-semibold rounded-full transition-colors duration-150 ${opt === value ? "bg-[#ffffff] text-[#0f172a] shadow-[0_10px_22px_-18px_rgba(15,23,42,0.25)] dark:bg-[#0f172a] dark:text-white dark:shadow-none" : "text-[#64748b] hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:text-white"}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
