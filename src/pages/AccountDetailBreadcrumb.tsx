import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

interface AccountDetailBreadcrumbProps {
  accountName: string;
}

export function AccountDetailBreadcrumb({ accountName }: AccountDetailBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/accounts" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        Accounts
      </Link>
      <ChevronRight size={14} />
      <span className="text-gray-900 dark:text-gray-100 font-medium">{accountName}</span>
    </nav>
  );
}
