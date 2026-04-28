export function CommandPaletteFooter() {
  return (
    <div className="flex gap-4 items-center px-4 py-2.5 border-t border-[#e2e8f0] text-[0.6875rem] text-[#94a3b8]">
      <span>
        <kbd className="font-sans">↑↓</kbd> navigate
      </span>
      <span>
        <kbd className="font-sans">↵</kbd> open
      </span>
      <span>
        <kbd className="font-sans">esc</kbd> close
      </span>
    </div>
  );
}
