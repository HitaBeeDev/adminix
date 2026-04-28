import type { RefObject } from "react";
import { Link } from "react-router";
import { Bell } from "lucide-react";
import type { TopbarNotification } from "./topbar.types";

interface TopbarNotificationsProps {
  isOpen: boolean;
  notifications: TopbarNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: number) => void;
  onToggle: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  unread: number;
}

export function TopbarNotifications({
  isOpen,
  notifications,
  onClose,
  onMarkAllRead,
  onMarkRead,
  onToggle,
  panelRef,
  unread,
}: TopbarNotificationsProps) {
  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={onToggle}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        aria-expanded={isOpen}
        className="relative w-[2.4rem] h-[2.4rem] flex items-center justify-center rounded-full bg-[#ffffff] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors focus-visible:outline-none shadow-[0_16px_34px_-28px_rgba(15,23,42,0.12)] dark:bg-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white dark:shadow-none"
      >
        <Bell strokeWidth={1.35} size={18} />

        {unread > 0 && (
          <span className="absolute top-[0.65rem] right-[0.65rem] w-[0.4rem] h-[0.4rem] rounded-full bg-[#f43f5e] ring-2 ring-[#ffffff] dark:ring-[#0f172a]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-80 bg-[#ffffff] rounded-3xl border border-[#e2e8f0] z-50 overflow-hidden shadow-[0_24px_70px_-45px_rgba(15,23,42,0.18)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] dark:border-[#1e293b]">
            <span className="text-[0.85rem] font-[500] text-[#0f172a] dark:text-white">
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[0.85rem] font-[400] text-[#6366f1] hover:underline transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          <ul className="max-h-72 overflow-y-auto divide-y divide-[#e2e8f0] dark:divide-[#1e293b]">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="w-full flex gap-3 px-4 py-3 text-left hover:bg-[#f8fafc] transition-colors dark:hover:bg-[#1e293b]"
                >
                  <div className="mt-2 shrink-0">
                    <span
                      className={`block w-1.5 h-1.5 rounded-full ${notification.read ? "bg-[#e2e8f0]" : "bg-[#6366f1]"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[0.85rem] ${notification.read ? "text-[#64748b] dark:text-[#94a3b8] font-[400]" : "text-[#0f172a] dark:text-white font-[500]"}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-[0.85rem] font-[400] mt-0.5 truncate text-[#94a3b8]">
                      {notification.description}
                    </p>
                  </div>
                  <span className="text-[0.85rem] font-[400] shrink-0 mt-0.5 text-[#94a3b8]">
                    {notification.time}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2.5 border-t border-[#e2e8f0] dark:border-[#1e293b]">
            <Link
              to="/activity"
              onClick={onClose}
              className="text-[0.85rem] font-[400] text-[#6366f1] hover:underline transition-colors"
            >
              View all activity →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
