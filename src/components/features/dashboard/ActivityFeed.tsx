import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ScrollText } from "lucide-react";
import type { DashboardStats } from "@/api/dashboard";
import { fmtRelative, ACTION_LABEL, activityBadge, activityIcon } from "@/lib/dashboardUtils";

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 4;

interface Props {
  data: DashboardStats | undefined;
  isLoading: boolean;
}

export default function ActivityFeed({ data, isLoading }: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const activities = data?.recentActivity ?? [];
  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activities.length]);

  return (
    <div className="bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] pt-3 pl-5 pr-5 pb-3 flex flex-col transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none">
      <div className="flex items-center justify-between mb-0">
        <h3 className="text-[1.05rem] font-[600] tracking-tight text-[#0f172a] dark:text-white">Recent Activity</h3>
        <Link
          to="/activity"
          className="flex items-center gap-1 text-[0.75rem] font-medium text-[#6366f1] hover:underline underline-offset-4 transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-start py-3 border-t border-[#e2e8f0] dark:border-[#1e293b]">
              <div className="w-8 h-8 rounded-full bg-[#f1f5f9] animate-pulse shrink-0 dark:bg-[#1e293b]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-48 rounded bg-[#f1f5f9] animate-pulse dark:bg-[#1e293b]" />
                <div className="h-3 w-28 rounded bg-[#f1f5f9] animate-pulse dark:bg-[#1e293b]" />
              </div>
              <div className="h-5 w-14 rounded-full bg-[#f1f5f9] animate-pulse dark:bg-[#1e293b]" />
            </div>
          ))}
        </div>
      ) : !activities.length ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center">
          <ScrollText size={24} className="text-[#94a3b8]" />
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
            Nothing's happened yet. Activity will show up here as your team uses the app.
          </p>
        </div>
      ) : (
        <>
          <ul className="flex-1">
            {visibleActivities.map((event) => {
              const badge = activityBadge(event.action);
              const IconComp = activityIcon(event.action);
              return (
                <li key={event.id} className="flex items-start gap-3 py-4 border-t border-[#e2e8f0] dark:border-[#1e293b]">
                  {IconComp ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#fffbeb]">
                      <IconComp size={16} className="text-[#d97706]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#eef2ff] text-[#6366f1] flex items-center justify-center text-[0.7rem] font-bold shrink-0">
                      {event.actorName?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#64748b] leading-snug dark:text-[#94a3b8]">
                      <span className="font-medium text-[#0f172a] dark:text-white">{event.actorName}</span>
                      {" "}
                      <span>{ACTION_LABEL[event.action] ?? event.action}</span>
                      {event.targetName && (
                        <> <span className="font-medium text-[#0f172a] dark:text-white">{event.targetName}</span></>
                      )}
                    </p>
                    <p className="text-[0.75rem] mt-0.5 text-[#94a3b8]">
                      {fmtRelative(event.timestamp)}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center h-5 px-2 rounded-full text-[0.625rem] font-medium uppercase tracking-wide ${badge.className}`}>
                    {badge.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_STEP, activities.length))}
            disabled={!hasMore}
            className="mt-4 w-full h-11 rounded-2xl text-sm font-semibold text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-45 dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
          >
            {hasMore ? `Load more (${activities.length - visibleActivities.length})` : "All activity loaded"}
          </button>
        </>
      )}
    </div>
  );
}
