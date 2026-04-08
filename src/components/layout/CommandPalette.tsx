import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const allItems = [
  { label: "Dashboard", path: "/dashboard", description: "Overview & KPIs" },
  { label: "Users", path: "/users", description: "Manage all users" },
  { label: "Accounts", path: "/accounts", description: "Manage organizations" },
  { label: "Roles", path: "/roles", description: "Permissions matrix" },
  { label: "Activity", path: "/activity", description: "Audit log" },
  { label: "Settings", path: "/settings", description: "Profile & preferences" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Reset active index when filtered results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

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

  if (!open) return null;

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
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <span className="text-gray-400 text-sm">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages..."
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-1.5 py-0.5"
          >
            esc
          </button>
        </div>

        {/* results */}
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-sm text-gray-400 text-center">
              No results for "{query}"
            </li>
          ) : (
            filtered.map((item, i) => (
              <li key={item.path}>
                <button
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                    i === activeIndex ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <span className={`text-sm font-medium ${i === activeIndex ? "text-indigo-700" : "text-gray-800"}`}>
                      {item.label}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">{item.description}</span>
                  </div>
                  {i === activeIndex && (
                    <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">↵</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>

        {/* footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
          <span><kbd className="font-sans">↑↓</kbd> navigate</span>
          <span><kbd className="font-sans">↵</kbd> open</span>
          <span><kbd className="font-sans">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
