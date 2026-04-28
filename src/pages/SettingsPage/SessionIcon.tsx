import { Globe, Smartphone } from "lucide-react";
import type { Session } from "./settings.types";

export function SessionIcon({ type }: { type: Session["icon"] }) {
  if (type === "mobile") return <Smartphone size={16} className="text-gray-500 dark:text-gray-400" />;
  if (type === "globe") return <Globe size={16} className="text-gray-500 dark:text-gray-400" />;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500 dark:text-gray-400"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
