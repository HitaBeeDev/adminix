import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useTheme, type ThemeOption } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import { DENSITY_OPTIONS, settingsSectionClass, THEMES } from "./settings.constants";
import { appearanceSchema, type AppearanceValues } from "./settings.schema";

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { register, control } = useForm<AppearanceValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { density: "comfortable" },
  });
  const density = useWatch({ control, name: "density" }) ?? "comfortable";

  function applyTheme(value: ThemeOption) {
    setTheme(value);
    toast.success("Appearance updated.");
  }

  return (
    <div className="space-y-6">
      <div className={settingsSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Theme</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Choose how Adminix looks to you</p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              onClick={() => applyTheme(value)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
                theme === value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  theme === value
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
                )}
              >
                <Icon size={18} />
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    theme === value ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
              </div>
              {theme === value && <CheckCircle2 size={14} className="text-indigo-500 absolute top-2 right-2" />}
            </button>
          ))}
        </div>
      </div>

      <div className={settingsSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Display Density</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Control how compact the UI feels</p>
        <div className="space-y-2">
          {DENSITY_OPTIONS.map(({ value, label, desc }) => (
            <label
              key={value}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                density === value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
              )}
            >
              <input type="radio" value={value} {...register("density")} className="accent-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
