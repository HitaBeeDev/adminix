import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Invalid email"),
  title: z.string().optional(),
  bio: z.string().max(200, "Max 200 characters").optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const appearanceSchema = z.object({
  density: z.enum(["compact", "comfortable", "spacious"]),
});

export type AppearanceValues = z.infer<typeof appearanceSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
