import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Key, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import {
  MOCK_SESSIONS,
  settingsErrorClass,
  settingsFieldClass,
  settingsLabelClass,
  settingsSectionClass,
} from "./settings.constants";
import { passwordSchema, type PasswordValues } from "./settings.schema";
import type { Session } from "./settings.types";
import { SessionIcon } from "./SessionIcon";
import { SettingsToggle } from "./SettingsToggle";

export function SecurityTab() {
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function updatePassword() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    resetPassword();
    toast.success("Password changed successfully.");
  }

  function handleToggle2FA() {
    if (twoFaEnabled) {
      setTwoFaEnabled(false);
      setShowQr(false);
      toast.info("Two-factor authentication disabled.");
      return;
    }

    setShowQr(true);
  }

  function confirmEnable() {
    setTwoFaEnabled(true);
    setShowQr(false);
    toast.success("Two-factor authentication enabled.");
  }

  async function revokeSession(id: string) {
    setRevokingId(id);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSessions((current) => current.filter((session) => session.id !== id));
    setRevokingId(null);
    toast.success("Session revoked.");
  }

  return (
    <div className="space-y-6">
      <div className={settingsSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Password</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Update your account password</p>
        <form onSubmit={handlePasswordSubmit(updatePassword)} className="space-y-3 max-w-sm">
          <div>
            <label className={settingsLabelClass}>Current Password</label>
            <input type="password" {...registerPassword("currentPassword")} className={settingsFieldClass} placeholder="********" />
            {passwordErrors.currentPassword && <p className={settingsErrorClass}>{passwordErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className={settingsLabelClass}>New Password</label>
            <input type="password" {...registerPassword("newPassword")} className={settingsFieldClass} placeholder="********" />
            {passwordErrors.newPassword && <p className={settingsErrorClass}>{passwordErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className={settingsLabelClass}>Confirm New Password</label>
            <input type="password" {...registerPassword("confirmPassword")} className={settingsFieldClass} placeholder="********" />
            {passwordErrors.confirmPassword && <p className={settingsErrorClass}>{passwordErrors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isPasswordSubmitting}
            className="mt-1 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
          >
            <Key size={14} />
            {isPasswordSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className={settingsSectionClass}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Add an extra layer of security using an authenticator app
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                twoFaEnabled
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
              )}
            >
              {twoFaEnabled ? "Enabled" : "Disabled"}
            </span>
            <SettingsToggle checked={twoFaEnabled} onChange={handleToggle2FA} />
          </div>
        </div>

        {showQr && (
          <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 shrink-0 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <svg viewBox="0 0 80 80" width="72" height="72" className="text-gray-900 dark:text-gray-100">
                  <rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="12" width="14" height="14" rx="1" fill="currentColor" />
                  <rect x="46" y="4" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="54" y="12" width="14" height="14" rx="1" fill="currentColor" />
                  <rect x="4" y="46" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="54" width="14" height="14" rx="1" fill="currentColor" />
                  <rect x="46" y="46" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="58" y="46" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="46" y="58" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="58" y="58" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="70" y="46" width="8" height="20" rx="1" fill="currentColor" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Scan with your authenticator app</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use Google Authenticator, Authy, or any TOTP-compatible app.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Manual entry key:</p>
                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 select-all">
                  JBSWY3DPEHPK3PXP
                </code>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={confirmEnable}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                  >
                    <CheckCircle2 size={12} /> Confirm & Enable
                  </button>
                  <button
                    onClick={() => setShowQr(false)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {twoFaEnabled && !showQr && (
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            Your account is protected with two-factor authentication.
          </div>
        )}

        {!twoFaEnabled && !showQr && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle size={13} />
            Your account is not protected with 2FA. We strongly recommend enabling it.
          </div>
        )}
      </div>

      <div className={settingsSectionClass}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Active Sessions</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Devices currently signed in to your account
            </p>
          </div>
          <button
            onClick={() => {
              setSessions((current) => current.filter((session) => session.current));
              toast.success("All other sessions revoked.");
            }}
            className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition flex items-center gap-1"
          >
            <LogOut size={12} />
            Revoke all others
          </button>
        </div>
        {sessions.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2 text-center">
            <LogOut size={22} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">All other sessions have been revoked.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">You'll be re-authenticated on your next visit.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <SessionIcon type={session.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{session.device}</p>
                    {session.current && (
                      <span className="text-[0.625rem] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    {session.location} - {session.ip} - {session.lastActive}
                  </p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => void revokeSession(session.id)}
                    disabled={revokingId === session.id}
                    className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition disabled:opacity-50 shrink-0"
                  >
                    {revokingId === session.id ? "Revoking..." : "Revoke"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
