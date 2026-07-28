import { z } from "zod";

const blogToneValues = ["Technical", "Reflective", "Direct", "Founder"] as const;
const blogFormatValues = ["Blog", "LinkedIn Post", "X Thread"] as const;

export const blogGenerationInputSchema = z.object({
  topic: z.string().trim().min(1).max(300),
  tone: z.enum(blogToneValues),
  format: z.enum(blogFormatValues),
});

export type BlogGenerationInput = z.infer<typeof blogGenerationInputSchema>;
