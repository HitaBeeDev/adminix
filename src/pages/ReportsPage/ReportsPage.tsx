import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "@/stores/toastStore";
import { GenerateReportModal } from "./GenerateReportModal";
import { INITIAL_REPORTS } from "./reports.constants";
import { reportFilterSchema, type ReportFilterValues } from "./reports.schema";
import type { Report } from "./reports.types";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsTable } from "./ReportsTable";
import { ReportsTypeFilter } from "./ReportsTypeFilter";

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { control: filterControl, setValue: setFilterValue } = useForm<ReportFilterValues>({
    resolver: zodResolver(reportFilterSchema),
    defaultValues: { typeFilter: "" },
  });
  const typeFilter = useWatch({ control: filterControl, name: "typeFilter" }) ?? "";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredReports = typeFilter ? reports.filter((report) => report.type === typeFilter) : reports;

  function handleGenerate(report: Report) {
    setReports((current) => [report, ...current]);
  }

  function handleRegenerate(id: string) {
    setReports((current) =>
      current.map((report) => (report.id === id ? { ...report, status: "generating" } : report)),
    );

    setTimeout(() => {
      setReports((current) =>
        current.map((report) =>
          report.id === id ? { ...report, status: "ready", generated: new Date().toISOString() } : report,
        ),
      );
    }, 1800);
  }

  function handleDelete() {
    if (!deleteTarget) return;

    setReports((current) => current.filter((report) => report.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 mt-4">
      <ReportsHeader
        filteredCount={filteredReports.length}
        isLoading={isLoading}
        totalCount={reports.length}
      />
      <GenerateReportModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={handleGenerate}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Report"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete report"
      />
      <ReportsTypeFilter
        onChange={(type) => setFilterValue("typeFilter", type, { shouldValidate: true })}
        onGenerate={() => setGenerateOpen(true)}
        typeFilter={typeFilter}
      />
      <ReportsTable
        isLoading={isLoading}
        onClearFilter={() => setFilterValue("typeFilter", "", { shouldValidate: true })}
        onDelete={setDeleteTarget}
        onGenerate={() => setGenerateOpen(true)}
        onRegenerate={handleRegenerate}
        reports={filteredReports}
        typeFilter={typeFilter}
      />
    </div>
  );
}
