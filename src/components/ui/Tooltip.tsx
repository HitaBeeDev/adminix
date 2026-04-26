import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  side?: Side;
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

const GAP = 6;

function getPosition(
  trigger: DOMRect,
  tooltip: DOMRect,
  side: Side,
): { top: number; left: number } {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  switch (side) {
    case 'top':
      return {
        top: trigger.top + scrollY - tooltip.height - GAP,
        left: trigger.left + scrollX + trigger.width / 2 - tooltip.width / 2,
      };
    case 'bottom':
      return {
        top: trigger.bottom + scrollY + GAP,
        left: trigger.left + scrollX + trigger.width / 2 - tooltip.width / 2,
      };
    case 'left':
      return {
        top: trigger.top + scrollY + trigger.height / 2 - tooltip.height / 2,
        left: trigger.left + scrollX - tooltip.width - GAP,
      };
    case 'right':
      return {
        top: trigger.top + scrollY + trigger.height / 2 - tooltip.height / 2,
        left: trigger.right + scrollX + GAP,
      };
  }
}

export default function Tooltip({
  content,
  side = 'top',
  delay = 400,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      setVisible(true);
    }, delay);
  }

  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setPos(null);
  }

  // Compute position after the tooltip renders
  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPos(getPosition(triggerRect, tooltipRect, side));
  }, [visible, side]);

  // Clone child to attach ref + event handlers
  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  const trigger = (
    <child.type
      {...child.props}
      ref={triggerRef}
      onMouseEnter={(e: React.MouseEvent) => { show(); child.props.onMouseEnter?.(e as never); }}
      onMouseLeave={(e: React.MouseEvent) => { hide(); child.props.onMouseLeave?.(e as never); }}
      onFocus={(e: React.FocusEvent) => { show(); child.props.onFocus?.(e as never); }}
      onBlur={(e: React.FocusEvent) => { hide(); child.props.onBlur?.(e as never); }}
    />
  );

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={
              pos
                ? { position: 'absolute', top: pos.top, left: pos.left }
                : { position: 'absolute', visibility: 'hidden', top: 0, left: 0 }
            }
            className={cn(
              'z-50 max-w-xs rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-gray-700',
              'pointer-events-none select-none',
              className,
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
