import type { JobPriority, JobStatus } from "@/data/jobs";

const STORAGE_KEY = "sagarflix.job-overrides.v1";

export type JobOverride = {
  status?: JobStatus;
  priority?: JobPriority;
  notes?: string;
  updatedAt: string;
};

export type JobOverrides = Record<string, JobOverride>;

function isBrowser() {
  return typeof window !== "undefined";
}

function readRawOverrides(): JobOverrides {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as JobOverrides;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

function writeRawOverrides(overrides: JobOverrides) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function loadJobOverrides() {
  return readRawOverrides();
}

export function saveJobOverride(slug: string, override: Omit<JobOverride, "updatedAt">) {
  const nextOverrides = {
    ...readRawOverrides(),
    [slug]: {
      ...override,
      updatedAt: new Date().toISOString(),
    },
  };

  writeRawOverrides(nextOverrides);
  return nextOverrides;
}

export function removeJobOverride(slug: string) {
  const nextOverrides = { ...readRawOverrides() };
  delete nextOverrides[slug];
  writeRawOverrides(nextOverrides);
  return nextOverrides;
}

export function clearJobOverrides() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
