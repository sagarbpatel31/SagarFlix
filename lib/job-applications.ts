import { Prisma } from "@prisma/client";
import type { JobStatus as DbJobStatus } from "@prisma/client";
import type { JobCompany, JobPriority, JobStatus } from "@/data/jobs";

export type JobApplicationRecord = {
  id: string;
  slug: string;
  company: string;
  careerUrl: string;
  roleKeywords: string;
  status: string;
  priority: JobPriority;
  notes: string;
  tags: string;
  location: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type JobApplicationPayload = Omit<JobCompany, "id">;

function toDbStatus(status: JobStatus) {
  return (status === "Follow-up" ? "Follow_up" : status) as DbJobStatus;
}

function fromDbStatus(status: string): JobStatus {
  return status === "Follow_up" ? "Follow-up" : (status as JobStatus);
}

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // fall through to comma-separated parsing
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeJobApplication(
  input: JobApplicationPayload,
  userId: string,
): Prisma.JobApplicationUncheckedCreateInput {
  return {
    slug: input.slug,
    company: input.company,
    careerUrl: input.careerUrl,
    roleKeywords: JSON.stringify(input.roleKeywords),
    status: toDbStatus(input.status),
    priority: input.priority,
    notes: input.notes,
    tags: JSON.stringify(input.tags),
    location: input.location,
    userId,
  };
}

export function serializeJobApplicationUpdate(
  input: Partial<Pick<JobCompany, "careerUrl" | "roleKeywords" | "status" | "priority" | "notes" | "tags" | "location">>,
): Prisma.JobApplicationUpdateInput {
  const payload: Prisma.JobApplicationUpdateInput = {};

  if (input.careerUrl !== undefined) payload.careerUrl = input.careerUrl;
  if (input.roleKeywords !== undefined) payload.roleKeywords = JSON.stringify(input.roleKeywords);
  if (input.status !== undefined) payload.status = toDbStatus(input.status);
  if (input.priority !== undefined) payload.priority = input.priority;
  if (input.notes !== undefined) payload.notes = input.notes;
  if (input.tags !== undefined) payload.tags = JSON.stringify(input.tags);
  if (input.location !== undefined) payload.location = input.location;

  return payload;
}

export function deserializeJobApplication(record: JobApplicationRecord): JobCompany {
  return {
    id: record.id,
    slug: record.slug,
    company: record.company,
    careerUrl: record.careerUrl,
    roleKeywords: parseList(record.roleKeywords),
    status: fromDbStatus(record.status),
    priority: record.priority,
    notes: record.notes,
    tags: parseList(record.tags),
    location: record.location,
  };
}
