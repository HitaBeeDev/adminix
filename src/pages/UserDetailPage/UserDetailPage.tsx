import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorState from "@/components/ui/ErrorState";
import { useDeleteUser, useUpdateUser, useUser } from "@/hooks/useUsers";
import { toast } from "@/stores/toastStore";
import type { UserStatus } from "@/types/user";
import { ActivityTab } from "./ActivityTab";
import { PermissionsTab } from "./PermissionsTab";
import { ProfileTab } from "./ProfileTab";
import { SecurityTab } from "./SecurityTab";
import { SessionsTab } from "./SessionsTab";
import { UserDetailContext } from "./UserDetailContext";
import { UserDetailHeader } from "./UserDetailHeader";
import { UserDetailSkeleton } from "./UserDetailSkeleton";
import { UserDetailTabs } from "./UserDetailTabs";
import type { UserDetailTab } from "./userDetail.types";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<UserDetailTab>("profile");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { data: user, isLoading, isError, error, refetch } = useUser(id ?? "");
  const updateUser = useUpdateUser(id ?? "");
  const deleteUser = useDeleteUser();

  if (isLoading) return <UserDetailSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-sm text-gray-500 dark:text-gray-400">User not found.</p>
        <Link to="/users" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  const currentUser = user;
  const isSuspended = currentUser.status === "suspended";

  async function handleSuspendToggle() {
    const newStatus: UserStatus = currentUser.status === "active" ? "suspended" : "active";

    try {
      await updateUser.mutateAsync({ status: newStatus });
      toast.success(
        newStatus === "suspended"
          ? `${currentUser.name} has been suspended.`
          : `${currentUser.name} has been reactivated.`,
      );
      setConfirmSuspend(false);
    } catch {
      toast.error(`Failed to ${newStatus === "suspended" ? "suspend" : "reactivate"} ${currentUser.name}.`);
    }
  }

  async function handleResetPassword() {
    setResetting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setResetting(false);
    setConfirmReset(false);
    toast.success(`Password reset email sent to ${currentUser.email}.`);
  }

  async function handleDelete() {
    try {
      await deleteUser.mutateAsync(currentUser.id);
      toast.success(`${currentUser.name} has been deleted.`);
      navigate("/users");
    } catch {
      toast.error(`Failed to delete ${currentUser.name}.`);
    }
  }

  return (
    <UserDetailContext.Provider value={{ user: currentUser, refreshUser: () => void refetch() }}>
      <div className="space-y-5 mt-4">
        <UserDetailHeader
          isPending={updateUser.isPending}
          isSuspended={isSuspended}
          onDelete={() => setConfirmDelete(true)}
          onResetPassword={() => setConfirmReset(true)}
          onSuspend={() => setConfirmSuspend(true)}
          user={currentUser}
        />
        <UserDetailTabs activeTab={tab} onChange={setTab} />

        {tab === "profile" && <ProfileTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "sessions" && <SessionsTab />}
        {tab === "permissions" && <PermissionsTab />}
        {tab === "security" && <SecurityTab />}

        <ConfirmDialog
          open={confirmSuspend}
          onClose={() => setConfirmSuspend(false)}
          onConfirm={handleSuspendToggle}
          title={isSuspended ? "Reactivate User" : "Suspend User"}
          description={
            isSuspended
              ? `Reactivate ${currentUser.name}'s account? They will regain access immediately.`
              : `Suspend ${currentUser.name}'s account? They will lose access until reactivated.`
          }
          confirmLabel={isSuspended ? "Reactivate" : "Suspend"}
          loading={updateUser.isPending}
        />
        <ConfirmDialog
          open={confirmReset}
          onClose={() => setConfirmReset(false)}
          onConfirm={handleResetPassword}
          title="Reset Password"
          description={`Send a password reset email to ${currentUser.email}?`}
          confirmLabel="Send Reset Email"
          loading={resetting}
        />
        <ConfirmDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          title="Delete User"
          description={`Are you sure you want to delete ${currentUser.name}? This action cannot be undone.`}
          confirmLabel="Delete User"
          loading={deleteUser.isPending}
        />
      </div>
    </UserDetailContext.Provider>
  );
}
