import type { UserGrowthDataPoint, UserGrowthPeriodMeta } from "./userGrowth.types";

export const DAILY_DATA: UserGrowthDataPoint[] = [
  { label: "Apr 1", current: 34, previous: 27 },
  { label: "Apr 2", current: 41, previous: 33 },
  { label: "Apr 3", current: 38, previous: 30 },
  { label: "Apr 4", current: 22, previous: 18 },
  { label: "Apr 5", current: 18, previous: 15 },
  { label: "Apr 6", current: 37, previous: 29 },
  { label: "Apr 7", current: 44, previous: 35 },
  { label: "Apr 8", current: 39, previous: 31 },
  { label: "Apr 9", current: 46, previous: 37 },
  { label: "Apr 10", current: 42, previous: 34 },
  { label: "Apr 11", current: 19, previous: 16 },
  { label: "Apr 12", current: 16, previous: 13 },
  { label: "Apr 13", current: 41, previous: 33 },
  { label: "Apr 14", current: 48, previous: 38 },
  { label: "Apr 15", current: 45, previous: 36 },
  { label: "Apr 16", current: 51, previous: 41 },
  { label: "Apr 17", current: 47, previous: 38 },
  { label: "Apr 18", current: 21, previous: 17 },
  { label: "Apr 19", current: 17, previous: 14 },
  { label: "Apr 20", current: 44, previous: 35 },
  { label: "Apr 21", current: 52, previous: 42 },
  { label: "Apr 22", current: 49, previous: 39 },
  { label: "Apr 23", current: 55, previous: 44 },
  { label: "Apr 24", current: 50, previous: 40 },
  { label: "Apr 25", current: 23, previous: 18 },
  { label: "Apr 26", current: 19, previous: 15 },
  { label: "Apr 27", current: 47, previous: 38 },
  { label: "Apr 28", current: 54, previous: 43 },
  { label: "Apr 29", current: 51, previous: 41 },
  { label: "Apr 30", current: 58, previous: 46 },
];

export const WEEKLY_DATA: UserGrowthDataPoint[] = [
  { label: "W1", current: 182, previous: 148 },
  { label: "W2", current: 201, previous: 163 },
  { label: "W3", current: 195, previous: 158 },
  { label: "W4", current: 218, previous: 177 },
  { label: "W5", current: 234, previous: 190 },
  { label: "W6", current: 221, previous: 179 },
  { label: "W7", current: 248, previous: 201 },
  { label: "W8", current: 241, previous: 195 },
  { label: "W9", current: 263, previous: 213 },
  { label: "W10", current: 258, previous: 209 },
  { label: "W11", current: 274, previous: 222 },
  { label: "W12", current: 291, previous: 236 },
];

export const PERIOD_META: Record<string, UserGrowthPeriodMeta> = {
  Monthly: { secondKpi: "This Month", footerAvgLabel: "Monthly Avg", rangeLabel: "12 months", xInterval: 0 },
  Weekly: { secondKpi: "This Week", footerAvgLabel: "Weekly Avg", rangeLabel: "12 weeks", xInterval: 1 },
  Daily: { secondKpi: "Today", footerAvgLabel: "Daily Avg", rangeLabel: "30 days", xInterval: 4 },
};

export const PERIOD_OPTIONS = ["Daily", "Weekly", "Monthly"];
