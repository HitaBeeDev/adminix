import type { ReactNode } from "react";

interface AccountDetailInfoRowProps {
  label: string;
  value: ReactNode;
}

export function AccountDetailInfoRow({ label, value }: AccountDetailInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}
