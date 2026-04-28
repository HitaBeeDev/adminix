import { z } from "zod";

export const editAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().optional(),
});

export type EditAccountValues = z.infer<typeof editAccountSchema>;
