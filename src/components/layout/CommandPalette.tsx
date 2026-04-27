import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";

const allItems = [
  { label: "Dashboard", path: "/dashboard", description: "Overview & KPIs" },
  { label: "Users", path: "/users", description: "Manage all users" },
  { label: "Accounts", path: "/accounts", description: "Manage organizations" },
  { label: "Roles", path: "/roles", description: "Permissions matrix" },
  { label: "Activity", path: "/activity", description: "Audit log" },
  { label: "Reports", path: "/reports", description: "Exports & analytics" },
  { label: "Settings", path: "/settings", description: "Profile & preferences" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commandSearchSchema = z.object({
  query: z.string(),
});

type CommandSearchValues = z.infer<typeof commandSearchSchema>;

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;

  return <CommandPaletteContent onClose={onClose} />;
}

function CommandPaletteContent({ onClose }: Pick<CommandPaletteProps, "onClose">) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { register, control, setFocus } = useForm<CommandSearchValues>({
    resolver: zodResolver(commandSearchSchema),
    defaultValues: { query: "" },
  });
  const query = useWatch({ control, name: "query" }) ?? "";

  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setTimeout(() => setFocus("query"), 10);
  }, [setFocus]);

  function handleSelect(path: string) {
    navigate(path);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[activeIndex]) handleSelect(filtered[activeIndex].path);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* palette card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-400 dark:text-gray-500 text-sm">⌘</span>
          <input
            {...register("query", { onChange: () => setActiveIndex(0) })}
            onKeyDown={handleKeyDown}
            placeholder="Search pages..."
            className="flex-1 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5"
          >
            esc
          </button>
        </div>

        {/* results */}
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500 text-center">
              No results for "{query}"
            </li>
          ) : (
            filtered.map((item, i) => (
              <li key={item.path}>
                <button
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                    i === activeIndex
                      ? "bg-indigo-50 dark:bg-indigo-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div>
                    <span className={`text-sm font-medium ${i === activeIndex ? "text-indigo-700 dark:text-indigo-300" : "text-gray-800 dark:text-gray-100"}`}>
                      {item.label}
                    </span>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">{item.description}</span>
                  </div>
                  {i === activeIndex && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5">↵</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>

        {/* footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span><kbd className="font-sans">↑↓</kbd> navigate</span>
          <span><kbd className="font-sans">↵</kbd> open</span>
          <span><kbd className="font-sans">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
