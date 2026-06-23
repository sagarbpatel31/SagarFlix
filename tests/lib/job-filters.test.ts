import { describe, expect, it } from "vitest";
import { filterJobs } from "@/lib/job-filters";
import { jobs } from "@/data/jobs";

describe("filterJobs", () => {
  it("matches by query across company, location, notes, keywords, and tags", () => {
    const result = filterJobs(jobs, "robotics validation", []);

    expect(result.map((job) => job.company)).toContain("Applied Intuition");
    expect(result.every((job) => job.company.includes("Robotics"))).toBe(false);
  });

  it("applies tag and status filters as an OR across active filters", () => {
    const byTag = filterJobs(jobs, "", ["Embedded"]);
    expect(byTag.some((job) => job.company === "NVIDIA")).toBe(true);
    expect(byTag.every((job) => job.tags.includes("Embedded") || job.status === "Embedded")).toBe(true);

    const byStatus = filterJobs(jobs, "", ["Interviewing"]);
    expect(byStatus.map((job) => job.company)).toContain("Anduril");
  });

  it("combines query and filters", () => {
    const result = filterJobs(jobs, "robotics", ["Applied"]);
    expect(result.map((job) => job.company)).toEqual(
      expect.arrayContaining(["Figure AI", "Applied Intuition"]),
    );
  });

  it("keeps multiple active filters as an OR match", () => {
    const result = filterJobs(jobs, "", ["Embedded", "Interviewing"]);

    expect(result.map((job) => job.company)).toEqual(
      expect.arrayContaining(["NVIDIA", "Anduril", "Apple"]),
    );
    expect(result.some((job) => job.status === "Interviewing" || job.tags.includes("Embedded"))).toBe(true);
  });
});
