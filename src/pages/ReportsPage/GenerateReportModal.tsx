import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import {
  DATE_PRESETS,
  REPORT_TYPE_OPTIONS,
  reportErrorClass,
  reportFieldClass,
  reportLabelClass,
} from "./reports.constants";
import { generateReportSchema, type GenerateReportValues } from "./reports.schema";
import { mockRowCount } from "./reports.utils";
import type { Report, ReportFormat } from "./reports.types";

interface GenerateReportModalProps {
  onClose: () => void;
  onGenerate: (report: Report) => void;
  open: boolean;
}

export function GenerateReportModal({ onClose, onGenerate, open }: GenerateReportModalProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerateReportValues>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: { format: "CSV" },
  });

  const format = useWatch({ control, name: "format" });

  function applyPreset(from: string, to: string) {
    setValue("from", from, { shouldValidate: true });
    setValue("to", to, { shouldValidate: true });
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: GenerateReportValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const typeLabel = REPORT_TYPE_OPTIONS.find((option) => option.value === values.type)?.label ?? values.type;
    const generated = new Date().toISOString();
    const newReport: Report = {
      id: `r-${generated.replace(/\D/g, "")}`,
      name: values.name,
      type: values.type,
      dateRange: `${values.from} - ${values.to}`,
      format: values.format,
      generated,
      status: "ready",
      rows: mockRowCount(values),
    };

    onGenerate(newReport);
    toast.success(`"${typeLabel}" report generated.`);
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Generate Report" description="Configure a new report to export.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={reportLabelClass}>Report name</label>
          <input
            {...register("name")}
            placeholder="e.g. Monthly User Summary"
            className={cn(reportFieldClass, errors.name && "border-rose-400 dark:border-rose-600")}
          />
          {errors.name && <p className={reportErrorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={reportLabelClass}>Report type</label>
          <select
            {...register("type")}
            className={cn(reportFieldClass, "appearance-none cursor-pointer", errors.type && "border-rose-400 dark:border-rose-600")}
          >
            <option value="">Select a type...</option>
            {REPORT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && <p className={reportErrorClass}>{errors.type.message}</p>}
        </div>

        <div>
          <label className={reportLabelClass}>Date range</label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.from(), preset.to())}
                className="px-2.5 py-1 text-xs rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
              <input
                type="date"
                {...register("from")}
                className={cn(reportFieldClass, errors.from && "border-rose-400 dark:border-rose-600")}
              />
              {errors.from && <p className={reportErrorClass}>{errors.from.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
              <input
                type="date"
                {...register("to")}
                className={cn(reportFieldClass, errors.to && "border-rose-400 dark:border-rose-600")}
              />
              {errors.to && <p className={reportErrorClass}>{errors.to.message}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className={reportLabelClass}>Format</label>
          <div className="flex gap-3">
            {(["CSV", "JSON"] as ReportFormat[]).map((option) => (
              <label
                key={option}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors",
                  format === option
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600",
                )}
              >
                <input type="radio" {...register("format")} value={option} className="sr-only" />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] font-medium disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
