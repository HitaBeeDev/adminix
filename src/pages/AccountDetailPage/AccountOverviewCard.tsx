import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Building2, Calendar, Check, Crown, Globe, Pencil, Users, X } from "lucide-react";
import { PLAN_STYLES, STATUS_STYLES } from "./accountDetail.constants";
import type { EditAccountValues } from "./accountDetail.schema";
import { fmt } from "./accountDetail.utils";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/account";

interface AccountOverviewCardProps {
  account: Account;
  errors: FieldErrors<EditAccountValues>;
  isEditing: boolean;
  isSaving: boolean;
  onCancelEdit: () => void;
  onSave: () => void;
  onStartEdit: () => void;
  register: UseFormRegister<EditAccountValues>;
}

export function AccountOverviewCard({
  account,
  errors,
  isEditing,
  isSaving,
  onCancelEdit,
  onSave,
  onStartEdit,
  register,
}: AccountOverviewCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-900/30 dark:ring-indigo-800/60">
            <Building2 size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            {isEditing ? (
              <div>
                <input
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                  className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-2 text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-800 dark:text-gray-100"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
            ) : (
              <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">{account.name}</h1>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", PLAN_STYLES[account.plan])}>
                {account.plan}
              </span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[account.status])}>
                {account.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={onStartEdit}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Pencil size={13} /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                <Check size={13} /> {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <AccountDetailCard
          icon={<Crown size={15} className="text-amber-500" />}
          label="Owner"
          value={account.ownerName}
        />
        <AccountDetailCard
          label="Owner email"
          value={
            <a href={`mailto:${account.ownerEmail}`} className="truncate text-indigo-600 hover:underline dark:text-indigo-400">
              {account.ownerEmail}
            </a>
          }
        />
        <AccountDetailCard
          icon={<Users size={15} className="text-gray-400" />}
          label="Members"
          value={account.membersCount}
        />
        <AccountDetailCard
          icon={<Globe size={15} className="text-gray-400" />}
          label="Domain"
          value={
            isEditing ? (
              <input
                {...register("domain")}
                placeholder="e.g. acme.com"
                className="w-full rounded-lg border border-indigo-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-800 dark:text-gray-100"
              />
            ) : account.domain ? (
              account.domain
            ) : (
              <span className="text-gray-400">-</span>
            )
          }
        />
        <AccountDetailCard
          icon={<Calendar size={15} className="text-gray-400" />}
          label="Created"
          value={fmt(account.createdDate)}
        />
        <AccountDetailCard
          label="Account ID"
          value={<span className="font-mono text-xs text-gray-500 dark:text-gray-400">{account.id}</span>}
        />
      </div>
    </div>
  );
}

function AccountDetailCard({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/35">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className="mt-1.5 flex min-w-0 items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {icon}
        <div className="min-w-0 truncate">{value}</div>
      </div>
    </div>
  );
}
