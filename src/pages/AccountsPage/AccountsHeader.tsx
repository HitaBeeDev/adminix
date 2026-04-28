interface AccountsHeaderProps {
  isLoading: boolean;
  onCreateAccount: () => void;
  total: number;
}

export function AccountsHeader({ isLoading, onCreateAccount, total }: AccountsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#181818]">Accounts</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? (
            <span className="block h-4 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : `${total} accounts`}
        </p>
      </div>
      <button
        onClick={onCreateAccount}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] transition-colors"
      >
        + New account
      </button>
    </div>
  );
}
