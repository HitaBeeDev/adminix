import { z } from "zod";

export const reportFilterSchema = z.object({
  typeFilter: z.enum(["", "Users", "Accounts", "Activity"]),
});

export type ReportFilterValues = z.infer<typeof reportFilterSchema>;

export const generateReportSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    type: z.enum(["Users", "Accounts", "Activity"], { message: "Select a report type" }),
    from: z.string().min(1, "Select a start date"),
    to: z.string().min(1, "Select an end date"),
    format: z.enum(["CSV", "JSON"]),
  })
  .refine((data) => data.from <= data.to, {
    message: "End date must be after start date",
    path: ["to"],
  });

export type GenerateReportValues = z.infer<typeof generateReportSchema>;
