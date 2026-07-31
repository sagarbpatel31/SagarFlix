import { z } from "zod";
import { blogGenerationInputSchema } from "@/lib/blog-generation-input";

export const blogGenerationResultSchema = z.object({
  title: z.string().min(1),
  summary: z.string().default(""),
  fullContent: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  socialPost: z.string().default(""),
});

export const blogDraftInputSchema = z.object({
  request: blogGenerationInputSchema,
  result: blogGenerationResultSchema,
  pinned: z.boolean().default(false),
  archived: z.boolean().default(false),
});

export const blogDraftUpdateSchema = z
  .object({
    request: blogGenerationInputSchema,
    result: blogGenerationResultSchema,
    pinned: z.boolean(),
    archived: z.boolean(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type BlogDraftUpdateInput = z.infer<typeof blogDraftUpdateSchema>;
