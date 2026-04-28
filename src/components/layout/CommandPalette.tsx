import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Search, LayoutGrid, Users, Building2, Activity, Settings, UserPlus, FileText, Moon, LogOut } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";

const NAV_ITEMS = [
  { label: "Go to Dashboard",  path: "/dashboard", icon: LayoutGrid, kbd: "" },
  { label: "Go to Users",      path: "/users",     icon: Users,       kbd: "" },
  { label: "Go to Accounts",   path: "/accounts",  icon: Building2,   kbd: "" },
  { label: "Go to Activity",   path: "/activity",  icon: Activity,    kbd: "" },
  { label: "Go to Settings",   path: "/settings",  icon: Settings,    kbd: "" },
];

const ACTION_ITEMS = [
  { label: "Invite user",      path: "/users",    icon: UserPlus, kbd: "" },
  { label: "Generate report",  path: "/reports",  icon: FileText,  kbd: "" },
  { label: "Toggle theme",     path: null,        icon: Moon,      kbd: "" },
  { label: "Sign out",         path: "/login",    icon: LogOut,    kbd: "" },
];

const schema = z.object({ query: z.string() });
type FormValues = z.infer<typeof schema>;

type PaletteItem = { label: string; path: string | null; icon: React.ElementType; kbd: string };

export default function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  if (!open) return null;
  return <CommandPaletteContent />;
}

function CommandPaletteContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);

  const { register, control, setFocus } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { query: "" },
  });
  const query = useWatch({ control, name: "query" }) ?? "";

  const allItems: PaletteItem[] = [...NAV_ITEMS, ...ACTION_ITEMS];
  const filtered: PaletteItem[] = query.trim()
    ? allItems.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => { setTimeout(() => setFocus("query"), 10); }, [setFocus]);

  function handleSelect(item: PaletteItem) {
    if (item.path) navigate(item.path);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { if (filtered[activeIndex]) handleSelect(filtered[activeIndex]); }
    else if (e.key === "Escape") setOpen(false);
  }

  const navLabels = new Set(NAV_ITEMS.map((i) => i.label));
  const navFiltered = filtered.filter((i) => navLabels.has(i.label));
  const actionLabels = new Set(ACTION_ITEMS.map((i) => i.label));
  const actionFiltered = filtered.filter((i) => actionLabels.has(i.label));

  const navOffset = 0;
  const actionOffset = navFiltered.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#181818]/40 backdrop-blur-sm" />

      {/* Palette */}
      <div className="relative w-full max-w-xl bg-[#ffffff] rounded-xl overflow-hidden shadow-[0_8px_24px_-8px_rgba(24,24,24,0.18),0_2px_4px_-2px_rgba(24,24,24,0.08)]">
        {/* Search row */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-[#181818]/8">
          <Search size={16} className="shrink-0 text-[#2e2e2e]/50" />
          <input
            {...register("query", { onChange: () => setActiveIndex(0) })}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search…"
            className="flex-1 text-sm text-[#181818] placeholder:text-[#2e2e2e]/50 bg-transparent outline-none"
          />
          <kbd className="text-[11px] font-medium px-1.5 py-0.5 rounded shrink-0 bg-[#fbdd74] text-[#2e2e2e]/60">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-center text-[#2e2e2e]/50">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              {navFiltered.length > 0 && (
                <Section label="Navigation" items={navFiltered} offset={navOffset} activeIndex={activeIndex} onSelect={handleSelect} onHover={setActiveIndex} />
              )}
              {actionFiltered.length > 0 && (
                <Section label="Actions" items={actionFiltered} offset={actionOffset} activeIndex={activeIndex} onSelect={handleSelect} onHover={setActiveIndex} />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 items-center px-4 py-2.5 border-t border-[#181818]/8 text-[11px] text-[#2e2e2e]/50">
          <span><kbd className="font-sans">↑↓</kbd> navigate</span>
          <span><kbd className="font-sans">↵</kbd> open</span>
          <span><kbd className="font-sans">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  items,
  offset,
  activeIndex,
  onSelect,
  onHover,
}: {
  label: string;
  items: PaletteItem[];
  offset: number;
  activeIndex: number;
  onSelect: (item: PaletteItem) => void;
  onHover: (i: number) => void;
}) {
  return (
    <>
      <p className="px-3 pt-3 pb-1 text-[11px] font-medium tracking-widest uppercase text-[#2e2e2e]/60">
        {label}
      </p>
      {items.map((item, localIdx) => {
        const globalIdx = offset + localIdx;
        const isActive = globalIdx === activeIndex;
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onMouseEnter={() => onHover(globalIdx)}
            onClick={() => onSelect(item)}
            className={`mx-1 flex w-[calc(100%_-_8px)] items-center gap-3 rounded-md px-3 py-2 text-left transition-colors duration-100 ${isActive ? "bg-[#fbdd74]" : "bg-transparent"}`}
          >
            <Icon size={16} className={`shrink-0 ${isActive ? "text-[#4fc4cf]" : "text-[#2e2e2e]/60"}`} />
            <span className={`flex-1 text-sm ${isActive ? "text-[#181818] font-medium" : "text-[#2e2e2e]"}`}>
              {item.label}
            </span>
            {item.kbd && (
              <kbd className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#fbdd74] text-[#2e2e2e]/60">
                {item.kbd}
              </kbd>
            )}
            {isActive && (
              <kbd className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#fbdd74] text-[#2e2e2e]/60">
                ↵
              </kbd>
            )}
          </button>
        );
      })}
    </>
  );
}
