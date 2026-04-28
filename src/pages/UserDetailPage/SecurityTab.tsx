import { Fingerprint, ShieldCheck, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "./userDetail.constants";
import { fmt } from "./userDetail.utils";
import { UserDetailInfoRow } from "./UserDetailInfoRow";
import { useUserDetailContext } from "./UserDetailContext";

export function SecurityTab() {
  const { user } = useUserDetailContext();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818] mb-5">Security & Access</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              user.twoFactorEnabled ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-gray-800",
            )}
          >
            <Fingerprint size={18} className={user.twoFactorEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
            <p className={cn("text-xs mt-0.5", user.twoFactorEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")}>
              {user.twoFactorEnabled ? "Enabled - account is protected" : "Disabled - account is less secure"}
            </p>
          </div>
          <div className="ml-auto shrink-0">
            {user.twoFactorEnabled ? (
              <ShieldCheck size={18} className="text-emerald-500" />
            ) : (
              <ShieldOff size={18} className="text-gray-300 dark:text-gray-600" />
            )}
          </div>
        </div>

        <div className="px-1">
          <UserDetailInfoRow
            label="Last IP address"
            value={user.lastIp ? <span className="font-mono text-xs">{user.lastIp}</span> : <span className="text-gray-400">-</span>}
          />
          <UserDetailInfoRow label="Last active" value={fmt(user.lastActive)} />
          <UserDetailInfoRow label="Account created" value={fmt(user.dateJoined)} />
          <UserDetailInfoRow
            label="Account status"
            value={
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[user.status])}>
                {user.status}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
