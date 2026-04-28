import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLogout } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { TopbarBreadcrumbs } from "./TopbarBreadcrumbs";
import { TopbarNotifications } from "./TopbarNotifications";
import { TopbarSearchButton } from "./TopbarSearchButton";
import { TopbarThemeButton } from "./TopbarThemeButton";
import { TopbarUserMenu } from "./TopbarUserMenu";
import { INITIAL_NOTIFICATIONS } from "./topbar.constants";
import type { TopbarNotification } from "./topbar.types";
import { buildBreadcrumbs, getTopbarTitle } from "./topbar.utils";

export function Topbar() {
  const { pathname } = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const setMobileOpen = useUiStore((state) => state.setMobileOpen);
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<TopbarNotification[]>(
    INITIAL_NOTIFICATIONS,
  );

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = buildBreadcrumbs(pathname);
  const isDark = resolvedTheme === "dark";
  const unread = notifications.filter((notification) => !notification.read).length;
  const userName = user?.name ?? "Admin User";
  const userRole = user?.role.replace(/_/g, " ") ?? "admin";

  useEffect(() => {
    document.title = getTopbarTitle(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }

      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    await logout.mutateAsync();
    setUserMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function markAllNotificationsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }

  function markNotificationRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  return (
    <header className="mt-4 bg-transparent flex items-start justify-between gap-4 px-4 shrink-0">
      <TopbarBreadcrumbs
        breadcrumbs={breadcrumbs}
        onOpenMobileNav={() => setMobileOpen(true)}
      />

      <div className="flex items-center gap-2 flex-1 justify-end">
        <TopbarSearchButton onOpenSearch={() => setCommandPaletteOpen(true)} />
        <TopbarNotifications
          isOpen={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkAllRead={markAllNotificationsRead}
          onMarkRead={markNotificationRead}
          onToggle={() => {
            setNotifOpen((open) => !open);
            setUserMenuOpen(false);
          }}
          panelRef={notifRef}
          unread={unread}
        />
        <TopbarThemeButton isDark={isDark} onToggleTheme={toggleTheme} />
        <TopbarUserMenu
          isOpen={userMenuOpen}
          onClose={() => setUserMenuOpen(false)}
          onLogout={handleLogout}
          onToggle={() => {
            setUserMenuOpen((open) => !open);
            setNotifOpen(false);
          }}
          panelRef={userRef}
          userName={userName}
          userRole={userRole}
        />
      </div>
    </header>
  );
}
