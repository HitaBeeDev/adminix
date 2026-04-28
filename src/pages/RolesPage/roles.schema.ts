import { z } from "zod";

export const addRoleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type AddRoleValues = z.infer<typeof addRoleSchema>;
