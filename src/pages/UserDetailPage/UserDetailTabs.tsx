import { cn } from "@/lib/utils";
import { USER_DETAIL_TABS } from "./userDetail.constants";
import type { UserDetailTab } from "./userDetail.types";

interface UserDetailTabsProps {
  activeTab: UserDetailTab;
  onChange: (tab: UserDetailTab) => void;
}

export function UserDetailTabs({ activeTab, onChange }: UserDetailTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-6 overflow-x-auto">
        {USER_DETAIL_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "px-1 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
