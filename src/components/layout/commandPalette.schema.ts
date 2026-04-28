import { z } from "zod";

export const commandPaletteSchema = z.object({
  query: z.string(),
});
