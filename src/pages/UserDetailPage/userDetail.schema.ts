import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["super_admin", "admin", "manager", "editor", "viewer", "guest"]),
});

export type EditUserValues = z.infer<typeof editUserSchema>;
