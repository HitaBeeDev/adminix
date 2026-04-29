import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ScrollText } from "lucide-react";
import type { DashboardStats } from "@/api/dashboard";
import type { ActivityEvent } from "@/types/activity";
import { fmtRelative, ACTION_LABEL, activityBadge, activityIcon } from "@/lib/dashboardUtils";

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 4;

function getAvatarStyle(action: ActivityEvent["action"]) {
  if (action.includes("delete") || action.includes("suspend"))
    return { bg: "bg-[#fff1f2]", text: "text-[#f43f5e]" };
  if (action.includes("role"))
    return { bg: "bg-[#fffbeb]", text: "text-[#d97706]" };
  if (action.includes("created") || action.includes("invited"))
    return { bg: "bg-[#eef2ff]", text: "text-[#6366f1]" };
  return { bg: "bg-[#f1f5f9]", text: "text-[#64748b]" };
}

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
    <div className="bg-white rounded-[1.25rem] border border-[#e2e8f0] p-5 flex flex-col transition-all duration-200 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(15,23,42,0.13)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[#0f172a] dark:text-white leading-snug">
            Recent Activity
          </h3>
          <p className="text-[0.75rem] text-[#94a3b8] mt-0.5">Latest actions across your workspace</p>
        </div>
        <Link
          to="/activity"
          className="flex items-center gap-1 text-[0.73rem] font-medium text-[#6366f1] hover:underline underline-offset-4 transition-colors shrink-0 mt-0.5"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-start py-3">
              <div className="w-9 h-9 rounded-full bg-[#f1f5f9] animate-pulse shrink-0 dark:bg-[#1e293b]" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3.5 w-48 rounded bg-[#f1f5f9] animate-pulse dark:bg-[#1e293b]" />
                <div className="h-3 w-28 rounded bg-[#f1f5f9] animate-pulse dark:bg-[#1e293b]" />
              </div>
              <div className="h-5 w-14 rounded-full bg-[#f1f5f9] animate-pulse dark:bg-[#1e293b]" />
            </div>
          ))}
        </div>
      ) : !activities.length ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="w-11 h-11 rounded-full bg-[#f1f5f9] dark:bg-[#1e293b] flex items-center justify-center">
            <ScrollText size={20} className="text-[#94a3b8]" />
          </div>
          <p className="text-[0.8125rem] text-[#64748b] dark:text-[#94a3b8] max-w-[22ch] leading-relaxed">
            Nothing yet. Activity will appear here as your team works.
          </p>
        </div>
      ) : (
        <>
          {/* ── Timeline ── */}
          <ul className="flex-1 mt-3 relative">
            {/* Vertical connector line threading through avatars */}
            <div
              className="absolute left-[1.0625rem] top-5 bottom-5 w-px bg-[#f1f5f9] dark:bg-[#1e293b]"
              aria-hidden="true"
            />

            {visibleActivities.map((event) => {
              const badge = activityBadge(event.action);
              const IconComp = activityIcon(event.action);
              const avatarStyle = getAvatarStyle(event.action);

              return (
                <li
                  key={event.id}
                  className="relative flex gap-3 py-2.5 -mx-5 px-5 hover:bg-[#f8fafc] dark:hover:bg-[#0a0f1e] transition-colors cursor-default group"
                >
                  {/* Avatar — z-10 so it sits on top of the connector line */}
                  <div
                    className={`relative z-10 w-[2.125rem] h-[2.125rem] rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0 ring-2 ring-white dark:ring-[#0f172a] group-hover:ring-[#f8fafc] dark:group-hover:ring-[#0a0f1e] transition-[box-shadow] ${avatarStyle.bg} ${avatarStyle.text}`}
                  >
                    {IconComp
                      ? <IconComp size={15} />
                      : (event.actorName?.charAt(0)?.toUpperCase() ?? "?")}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-[0.8125rem] leading-snug text-[#64748b] dark:text-[#94a3b8]">
                      <span className="font-semibold text-[#0f172a] dark:text-white">
                        {event.actorName}
                      </span>
                      {" "}
                      <span>{ACTION_LABEL[event.action] ?? event.action}</span>
                      {event.targetName && (
                        <>
                          {" "}
                          <span className="font-semibold text-[#0f172a] dark:text-white">
                            {event.targetName}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-[0.7rem] mt-0.5 text-[#94a3b8]">
                      {fmtRelative(event.timestamp)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 self-start mt-0.5 inline-flex items-center h-5 px-2 rounded-full text-[0.6rem] font-semibold uppercase tracking-wide ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* ── Load more ── */}
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_STEP, activities.length))}
            disabled={!hasMore}
            className="mt-3 w-full h-10 rounded-xl text-[0.78rem] font-semibold border border-[#e2e8f0] text-[#64748b] transition-all hover:bg-[#f8fafc] hover:text-[#0f172a] hover:border-[#cbd5e1] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#111827] dark:hover:text-white dark:hover:border-[#334155]"
          >
            {hasMore
              ? `Load more (${activities.length - visibleActivities.length})`
              : "All activity loaded"}
          </button>
        </>
      )}
    </div>
  );
}
