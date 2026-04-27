import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogin } from "@/hooks/useAuth";

const loginSchema = z.object({
  email:      z.string().min(1, "Email is required").email("Enter a valid email address"),
  password:   z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      await login.mutateAsync(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-highlight mb-4">
            <LayoutGrid size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-headline">Adminix</h1>
          <p className="mt-1 text-[13px]" style={{ color: "color-mix(in srgb, var(--paragraph) 70%, transparent)" }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-main rounded-xl border border-stroke/8 p-8"
          style={{ boxShadow: "0 8px 24px -8px color-mix(in srgb, var(--stroke) 12%, transparent)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {serverError && (
              <div
                className="rounded-md px-4 py-3 text-sm"
                style={{
                  background: "color-mix(in srgb, var(--secondary) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--secondary) 25%, transparent)",
                  color: "var(--secondary)",
                }}
              >
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-headline">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                {...register("email")}
                placeholder="you@example.com"
                className={cn(
                  "w-full h-9 rounded-md border px-3 text-sm text-headline bg-main placeholder:text-paragraph/50 transition-colors",
                  "focus:outline-none focus:ring-[3px] focus:ring-highlight/25",
                  errors.email
                    ? "border-secondary ring-[3px] ring-secondary/18"
                    : "border-stroke/15 hover:border-stroke/30 focus:border-stroke/60"
                )}
              />
              {errors.email && (
                <p className="text-[12px] text-secondary">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium text-headline">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-9 rounded-md border px-3 pr-10 text-sm text-headline bg-main placeholder:text-paragraph/50 transition-colors",
                    "focus:outline-none focus:ring-[3px] focus:ring-highlight/25",
                    errors.password
                      ? "border-secondary ring-[3px] ring-secondary/18"
                      : "border-stroke/15 hover:border-stroke/30 focus:border-stroke/60"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph/50 hover:text-paragraph transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-secondary">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-stroke/30 accent-highlight"
              />
              <label htmlFor="rememberMe" className="text-[13px] text-paragraph/70">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-md bg-button text-button-text text-sm font-medium transition-colors hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-highlight/25"
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px]" style={{ color: "color-mix(in srgb, var(--paragraph) 50%, transparent)" }}>
          Demo: any email · password:{" "}
          <span className="font-mono font-medium text-paragraph/60">password</span>
        </p>
      </div>
    </div>
  );
}
