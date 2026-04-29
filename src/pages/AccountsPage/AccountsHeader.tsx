interface AccountsHeaderProps {
  title?: string;
}

export function AccountsHeader({ title = "Accounts" }: AccountsHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-[#181818]">{title}</h1>
    </div>
  );
}
