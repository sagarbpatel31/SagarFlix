import { z } from "zod";

const jobStatusValues = ["Saved", "Applied", "Interviewing", "Rejected", "Follow-up"] as const;
const jobPriorityValues = ["High", "Medium", "Low"] as const;

export const jobApplicationInputSchema = z.object({
  slug: z.string().min(1),
  company: z.string().min(1),
  careerUrl: z.string().url(),
  roleKeywords: z.array(z.string().min(1)).default([]),
  status: z.enum(jobStatusValues).default("Saved"),
  priority: z.enum(jobPriorityValues).default("Medium"),
  notes: z.string().default(""),
  tags: z.array(z.string().min(1)).default([]),
  location: z.string().default(""),
});

export const jobApplicationUpdateSchema = jobApplicationInputSchema
  .partial()
  .omit({ slug: true, company: true });

export type JobApplicationInput = z.infer<typeof jobApplicationInputSchema>;
export type JobApplicationUpdateInput = z.infer<typeof jobApplicationUpdateSchema>;
