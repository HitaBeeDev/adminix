import { useState } from "react";
import { toast } from "@/stores/toastStore";
import { NOTIF_GROUPS, settingsSectionClass } from "./settings.constants";
import { SettingsToggle } from "./SettingsToggle";

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIF_GROUPS.flatMap((group) => group.items.map((item) => [item.key, true]))),
  );

  function toggle(key: string) {
    setPrefs((current) => {
      const next = { ...current, [key]: !current[key] };
      toast.success("Notification preference saved.");
      return next;
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {NOTIF_GROUPS.map((group) => (
        <div key={group.group} className={settingsSectionClass}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{group.group}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Email and in-app notifications</p>
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            {group.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <SettingsToggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
