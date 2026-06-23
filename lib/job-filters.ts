import type { JobCompany } from "@/data/jobs";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function jobSearchText(job: JobCompany) {
  return [
    job.company,
    job.location,
    job.notes,
    job.roleKeywords.join(" "),
    job.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterJobs(
  jobs: JobCompany[],
  query: string,
  activeFilters: string[],
) {
  const normalizedQuery = normalizeText(query);

  return jobs.filter((job) => {
    const matchesQuery =
      normalizedQuery.length === 0 || jobSearchText(job).includes(normalizedQuery);

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) => job.tags.includes(filter) || job.status === filter);

    return matchesQuery && matchesFilters;
  });
}

