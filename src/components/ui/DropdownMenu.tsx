import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// ── Item types ────────────────────────────────────────────────────────────────

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  hidden?: boolean;
}

export type DropdownSection = DropdownItem[];

// ── Helpers ───────────────────────────────────────────────────────────────────

type Align = 'left' | 'right';

function getMenuPosition(
  trigger: HTMLElement,
  align: Align,
): { top: number; left: number } {
  const rect = trigger.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 4;
  const left =
    align === 'right'
      ? rect.right + window.scrollX
      : rect.left + window.scrollX;
  return { top, left };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DropdownMenuProps {
  trigger: React.ReactNode;
  sections: DropdownSection[];
  align?: Align;
  className?: string;
}

export default function DropdownMenu({
  trigger,
  sections,
  align = 'right',
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    if (!triggerRef.current) return;
    setPos(getMenuPosition(triggerRef.current, align));
    setOpen(true);
  }

  // Reposition on scroll / resize while open
  useEffect(() => {
    if (!open) return;
    function reposition() {
      if (triggerRef.current) setPos(getMenuPosition(triggerRef.current, align));
    }
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, align]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        menuRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Keyboard navigation within menu
  function onMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
      ) ?? [],
    );
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    }
  }

  const visibleSections = sections
    .map((s) => s.filter((i) => !i.hidden))
    .filter((s) => s.length > 0);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={openMenu}
        className={cn(
          'inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400',
          'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
          className,
        )}
      >
        {trigger}
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            onKeyDown={onMenuKeyDown}
            style={{
              position: 'absolute',
              top: pos.top,
              ...(align === 'right'
                ? { right: `calc(100vw - ${pos.left}px)` }
                : { left: pos.left }),
            }}
            className="z-50 min-w-[10rem] rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {visibleSections.map((section, si) => (
              <div key={si}>
                {si > 0 && (
                  <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                )}
                {section.map((item, ii) => (
                  <button
                    key={ii}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                      'disabled:pointer-events-none disabled:opacity-40',
                      'focus-visible:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-800',
                      item.destructive
                        ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
                    )}
                  >
                    {item.icon && (
                      <span className="flex h-4 w-4 items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
