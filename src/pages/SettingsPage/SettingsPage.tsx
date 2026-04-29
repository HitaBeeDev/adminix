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

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
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

      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "appearance" && <AppearanceTab />}
      {activeTab === "security" && <SecurityTab />}
    </div>
  );
}
