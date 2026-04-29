import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorState from "@/components/ui/ErrorState";
import { useAccount, useDeleteAccount, useUpdateAccount } from "@/hooks/useAccounts";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "@/stores/toastStore";
import type { AccountStatus } from "@/types/account";
import { AccountActivityChart } from "./AccountActivityChart";
import { AccountDangerZone } from "./AccountDangerZone";
import { AccountDetailBreadcrumb } from "./AccountDetailBreadcrumb";
import { AccountDetailSkeleton } from "./AccountDetailSkeleton";
import { AccountMembersTable } from "./AccountMembersTable";
import { AccountOverviewCard } from "./AccountOverviewCard";
import { editAccountSchema, type EditAccountValues } from "./accountDetail.schema";
import { mockWeeklyActivity } from "./accountDetail.utils";

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditAccountValues>({
    resolver: zodResolver(editAccountSchema),
  });

  const { data: account, isLoading, isError, error, refetch } = useAccount(id ?? "");
  const updateAccount = useUpdateAccount(id ?? "");
  const deleteAccount = useDeleteAccount();

  const { data: membersData, isLoading: membersLoading } = useUsers(
    account ? { accountId: account.id, pageSize: 50 } : {},
  );
  const members = membersData?.data ?? [];

  if (isLoading) return <AccountDetailSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-sm text-gray-500 dark:text-gray-400">Account not found.</p>
        <Link to="/accounts" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Accounts
        </Link>
      </div>
    );
  }

  const currentAccount = account;
  const isSuspended = currentAccount.status === "suspended";
  const weeklyData = mockWeeklyActivity(currentAccount.id, currentAccount.membersCount);

  function startEditing() {
    reset({
      name: currentAccount.name,
      domain: currentAccount.domain ?? "",
    });
    setIsEditing(true);
  }

  async function saveEdit(values: EditAccountValues) {
    try {
      await updateAccount.mutateAsync({ name: values.name, domain: values.domain || undefined });
      toast.success("Account updated.");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update account.");
    }
  }

  async function handleSuspendToggle() {
    const newStatus: AccountStatus = isSuspended ? "active" : "suspended";

    try {
      await updateAccount.mutateAsync({ status: newStatus });
      toast.success(
        isSuspended ? `${currentAccount.name} reactivated.` : `${currentAccount.name} suspended.`,
      );
      setConfirmSuspend(false);
    } catch {
      toast.error("Failed to update account status.");
    }
  }

  async function handleDelete() {
    try {
      await deleteAccount.mutateAsync(currentAccount.id);
      toast.success(`${currentAccount.name} has been deleted.`);
      navigate("/accounts");
    } catch {
      toast.error("Failed to delete account.");
    }
  }

  return (
    <div className="mt-4 space-y-5">
      <AccountDetailBreadcrumb accountName={currentAccount.name} />
      <AccountOverviewCard
        account={currentAccount}
        errors={errors}
        isEditing={isEditing}
        isSaving={updateAccount.isPending}
        onCancelEdit={() => setIsEditing(false)}
        onSave={() => void handleSubmit(saveEdit)()}
        onStartEdit={startEditing}
        register={register}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
        <AccountMembersTable account={currentAccount} isLoading={membersLoading} members={members} />
        <AccountActivityChart weeklyData={weeklyData} />
      </div>

      <AccountDangerZone
        isPending={updateAccount.isPending}
        isSuspended={isSuspended}
        onConfirmDelete={() => setConfirmDelete(true)}
        onConfirmSuspend={() => setConfirmSuspend(true)}
      />

      <ConfirmDialog
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        onConfirm={handleSuspendToggle}
        title={isSuspended ? "Reactivate Account" : "Suspend Account"}
        description={
          isSuspended
            ? `Reactivate ${currentAccount.name}? Members will regain access immediately.`
            : `Suspend ${currentAccount.name}? All ${currentAccount.membersCount} member${currentAccount.membersCount !== 1 ? "s" : ""} will lose access until reactivated.`
        }
        confirmLabel={isSuspended ? "Reactivate" : "Suspend"}
        loading={updateAccount.isPending}
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description={`Permanently delete ${currentAccount.name}? This will remove all ${currentAccount.membersCount} member${currentAccount.membersCount !== 1 ? "s" : ""} and cannot be undone.`}
        confirmLabel="Delete Account"
        loading={deleteAccount.isPending}
      />
    </div>
  );
}
