import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Building2, Calendar, Check, Crown, Globe, Pencil, Users, X } from "lucide-react";
import { PLAN_STYLES, STATUS_STYLES } from "./accountDetail.constants";
import { AccountDetailInfoRow } from "./AccountDetailInfoRow";
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
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
            <Building2 size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            {isEditing ? (
              <div>
                <input
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                  className="text-xl font-bold w-full px-2 py-1 rounded-lg border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-[#181818] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
            ) : (
              <h1 className="text-xl font-bold text-gray-900 dark:text-[#181818]">{account.name}</h1>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Pencil size={13} /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] font-medium disabled:opacity-50 transition-colors"
              >
                <Check size={13} /> {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
        <div>
          <AccountDetailInfoRow
            label="Owner"
            value={
              <span className="flex items-center gap-1.5">
                <Crown size={12} className="text-amber-500" />
                {account.ownerName}
              </span>
            }
          />
          <AccountDetailInfoRow
            label="Owner email"
            value={
              <a href={`mailto:${account.ownerEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                {account.ownerEmail}
              </a>
            }
          />
          <AccountDetailInfoRow
            label="Members"
            value={
              <span className="flex items-center gap-1.5">
                <Users size={12} className="text-gray-400" />
                {account.membersCount}
              </span>
            }
          />
        </div>
        <div>
          <AccountDetailInfoRow
            label="Domain"
            value={
              isEditing ? (
                <input
                  {...register("domain")}
                  placeholder="e.g. acme.com"
                  className="w-40 px-2 py-1 text-sm rounded-lg border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-[#181818] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : account.domain ? (
                <span className="flex items-center gap-1.5">
                  <Globe size={12} className="text-gray-400" />
                  {account.domain}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )
            }
          />
          <AccountDetailInfoRow
            label="Created"
            value={
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-400" />
                {fmt(account.createdDate)}
              </span>
            }
          />
          <AccountDetailInfoRow
            label="Account ID"
            value={<span className="font-mono text-xs text-gray-500 dark:text-gray-400">{account.id}</span>}
          />
        </div>
      </div>
    </div>
  );
}
