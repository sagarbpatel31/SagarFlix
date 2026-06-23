import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchJobsFromSheet, parseCsv } from "@/lib/jobs-sheet";
import { jobMetaByCompany } from "@/data/jobs";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseCsv", () => {
  it("parses quoted values and multiline rows", () => {
    const csv = [
      'company,careerUrl,roleKeywords,tags,notes',
      '"Figure AI","https://figure.ai/careers","Humanoid Robotics|Controls","Robotics|AI/ML","Line one, with comma"',
      "Remote AI Lab,https://example.com/careers,AI/ML|Platform,Remote|AI/ML,Simple note",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      ["company", "careerUrl", "roleKeywords", "tags", "notes"],
      [
        "Figure AI",
        "https://figure.ai/careers",
        "Humanoid Robotics|Controls",
        "Robotics|AI/ML",
        "Line one, with comma",
      ],
      [
        "Remote AI Lab",
        "https://example.com/careers",
        "AI/ML|Platform",
        "Remote|AI/ML",
        "Simple note",
      ],
    ]);
  });

  it("preserves commas and line breaks inside quoted cells", () => {
    const csv = [
      "company,notes",
      '"SignalForge","First line, with comma"',
      '"Sagar OS","Line one',
      'Line two, still quoted"',
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      ["company", "notes"],
      ["SignalForge", "First line, with comma"],
      ["Sagar OS", "Line one\nLine two, still quoted"],
    ]);
  });

  it("unescapes doubled quotes inside quoted cells", () => {
    const csv = [
      "company,notes",
      '"SignalForge","She said ""ship it"""',
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      ["company", "notes"],
      ["SignalForge", 'She said "ship it"'],
    ]);
  });

  it("handles commas and escaped quotes in the same quoted cell", () => {
    const csv = [
      "company,notes",
      '"SignalForge","We said, ""ship it"" and shipped"',
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      ["company", "notes"],
      ["SignalForge", 'We said, "ship it" and shipped'],
    ]);
  });

  it("ignores blank rows and whitespace-only rows", () => {
    const csv = [
      "company,notes",
      "",
      "   ",
      "SignalForge,Live surface",
      "\t",
      "Sagar OS,Internal OS",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      ["company", "notes"],
      ["SignalForge", "Live surface"],
      ["Sagar OS", "Internal OS"],
    ]);
  });
});

describe("fetchJobsFromSheet", () => {
  it("maps structured sheet rows into company cards", async () => {
    const csv = [
      "company,careerUrl,roleKeywords,status,priority,notes,tags,location,slug",
      'Figure AI,https://www.figure.ai/careers,"Humanoid Robotics|Controls",Applied,High,"Direct sheet note","Robotics|AI/ML|California",Sunnyvale,figure-ai',
      'Custom Robotics,https://example.com,"Robotics|Autonomy",Saved,Medium,"Custom note","Robotics|Remote",Remote,custom-robotics',
    ].join("\n");

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(csv, { status: 200 })) as unknown as typeof fetch,
    );

    const result = await fetchJobsFromSheet();

    expect(result.source).toBe("sheet");
    expect(result.jobs).toHaveLength(2);
    expect(result.jobs[0]).toMatchObject({
      company: "Figure AI",
      careerUrl: "https://www.figure.ai/careers",
      roleKeywords: ["Humanoid Robotics", "Controls"],
      status: "Applied",
      priority: "High",
      notes: "Direct sheet note",
      tags: ["Robotics", "AI/ML", "California"],
      location: "Sunnyvale",
      slug: "figure-ai",
    });
    expect(result.jobs[1]).toMatchObject({
      company: "Custom Robotics",
      careerUrl: "https://example.com",
      roleKeywords: ["Robotics", "Autonomy"],
      status: "Saved",
      priority: "Medium",
      notes: "Custom note",
      tags: ["Robotics", "Remote"],
      location: "Remote",
      slug: "custom-robotics",
    });
  });

  it("falls back when the sheet only contains a structured header row", async () => {
    const csv = [
      "company,careerUrl,roleKeywords,status,priority,notes,tags,location,slug",
    ].join("\n");

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(csv, { status: 200 })) as unknown as typeof fetch,
    );

    const result = await fetchJobsFromSheet();

    expect(result.source).toBe("fallback");
    expect(result.jobs.length).toBeGreaterThan(0);
    expect(result.jobs.map((job) => job.company)).toContain("NVIDIA");
  });

  it("falls back to the local company dataset when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch);

    const result = await fetchJobsFromSheet();

    expect(result.source).toBe("fallback");
    expect(result.jobs).toHaveLength(Object.keys(jobMetaByCompany).length);
    expect(result.jobs[0]).toHaveProperty("company");
  });
});
