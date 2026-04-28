import { useEffect, useState, type KeyboardEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { useUiStore } from "@/stores/uiStore";
import { CommandPaletteFooter } from "./CommandPaletteFooter";
import { CommandPaletteResults } from "./CommandPaletteResults";
import { CommandPaletteSearch } from "./CommandPaletteSearch";
import { commandPaletteSchema } from "./commandPalette.schema";
import type { CommandPaletteFormValues, PaletteItem } from "./commandPalette.types";
import { filterPaletteItems } from "./commandPalette.utils";

export function CommandPalette() {
  const open = useUiStore((state) => state.commandPaletteOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen);

  const { control, register, setFocus } = useForm<CommandPaletteFormValues>({
    resolver: zodResolver(commandPaletteSchema),
    defaultValues: { query: "" },
  });
  const query = useWatch({ control, name: "query" }) ?? "";
  const filteredItems = filterPaletteItems(query);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => setFocus("query"), 10);
    return () => window.clearTimeout(timer);
  }, [open, setFocus]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  function handleSelect(item: PaletteItem) {
    if (item.path) navigate(item.path);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filteredItems.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      if (filteredItems[activeIndex]) handleSelect(filteredItems[activeIndex]);
      return;
    }

    if (event.key === "Escape") setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
        onMouseDown={() => setOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[#ffffff] rounded-xl overflow-hidden shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18),0_2px_4px_-2px_rgba(15,23,42,0.08)]">
        <CommandPaletteSearch
          onKeyDown={handleKeyDown}
          onQueryChange={() => setActiveIndex(0)}
          register={register}
        />
        <CommandPaletteResults
          activeIndex={activeIndex}
          filteredItems={filteredItems}
          onHover={setActiveIndex}
          onSelect={handleSelect}
          query={query}
        />
        <CommandPaletteFooter />
      </div>
    </div>
  );
}
