import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppearanceTab } from "./AppearanceTab";
import { NotificationsTab } from "./NotificationsTab";
import { ProfileTab } from "./ProfileTab";
import { SecurityTab } from "./SecurityTab";
import { TABS } from "./settings.constants";
import type { TabId } from "./settings.types";
import { getInitialSettingsTab } from "./settings.utils";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>(getInitialSettingsTab);

  return (
    <div className="mt-4 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="-mx-4 overflow-x-auto border-b border-gray-200 px-4 dark:border-gray-800 sm:mx-0 sm:px-0">
        <div role="tablist" className="flex min-w-max gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`settings-panel-${id}`}
            id={`settings-tab-${id}`}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4",
              activeTab === id
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`settings-panel-${activeTab}`}
        aria-labelledby={`settings-tab-${activeTab}`}
      >
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "security" && <SecurityTab />}
      </div>
    </div>
  );
}
