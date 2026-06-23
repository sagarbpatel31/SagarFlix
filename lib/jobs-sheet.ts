import type { JobCompany, JobMeta } from "@/data/jobs";
import { jobMetaByCompany } from "@/data/jobs";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1QezZa9Y8OK-XImA_wqZg2vNoon5L8e_qv9xKsQ1aKiA/gviz/tq?tqx=out:csv&gid=1942102382";

const EMBEDDED_KEYWORDS = [
  "nvidia",
  "apple",
  "intel",
  "amd",
  "arm",
  "broadcom",
  "microchip",
  "analog devices",
  "bosch",
  "keysight",
  "qualcomm",
  "embedded",
  "kernel",
  "semiconductor",
  "electronics",
];

const ROBOTICS_KEYWORDS = [
  "robot",
  "robotics",
  "autonomous",
  "autonomy",
  "drone",
  "zipline",
  "figure",
  "apptronik",
  "boston dynamics",
  "anduril",
  "sim",
  "simulation",
  "cruise",
  "waymo",
  "mobility",
];

const AI_KEYWORDS = [
  " ai",
  "ai ",
  "ai/",
  "openai",
  "anthropic",
  "deep",
  "brain",
  "llm",
  "machine learning",
  "ml",
  "c3 ai",
  "cohere",
  "mistral",
];

type SheetRowRecord = {
  company?: string;
  careerUrl?: string;
  roleKeywords?: string[];
  status?: JobMeta["status"];
  priority?: JobMeta["priority"];
  notes?: string;
  tags?: string[];
  location?: string;
  slug?: string;
};

type NormalizedHeader =
  | "company"
  | "careerUrl"
  | "roleKeywords"
  | "status"
  | "priority"
  | "notes"
  | "tags"
  | "location"
  | "slug";

export type JobsSheetSource = "sheet" | "fallback";

export type JobsSheetResult = {
  jobs: JobCompany[];
  source: JobsSheetSource;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function normalizeHeader(value: string): NormalizedHeader | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  switch (normalized) {
    case "company":
    case "companyname":
    case "name":
      return "company";
    case "careerurl":
    case "careerpage":
    case "url":
    case "link":
      return "careerUrl";
    case "rolekeywords":
    case "roles":
    case "keywords":
    case "role":
      return "roleKeywords";
    case "status":
      return "status";
    case "priority":
      return "priority";
    case "notes":
    case "note":
      return "notes";
    case "tags":
      return "tags";
    case "location":
    case "city":
    case "remote":
      return "location";
    case "slug":
      return "slug";
    default:
      return null;
  }
}

function splitList(value: string) {
  return value
    .split(/[,|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseStatus(value: string): JobMeta["status"] | undefined {
  const normalized = value.trim().toLowerCase();
  if (normalized === "saved") return "Saved";
  if (normalized === "applied") return "Applied";
  if (normalized === "interviewing") return "Interviewing";
  if (normalized === "rejected") return "Rejected";
  if (normalized === "follow-up" || normalized === "follow up") return "Follow-up";
  return undefined;
}

function parsePriority(value: string): JobMeta["priority"] | undefined {
  const normalized = value.trim().toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  if (normalized === "low") return "Low";
  return undefined;
}

function buildRowRecord(
  headers: Array<NormalizedHeader | null>,
  cells: string[],
): SheetRowRecord {
  const record: SheetRowRecord = {};

  headers.forEach((header, index) => {
    if (!header) {
      return;
    }

    const value = cells[index]?.trim();
    if (!value) {
      return;
    }

    if (header === "roleKeywords" || header === "tags") {
      record[header] = splitList(value);
      return;
    }

    if (header === "status") {
      record.status = parseStatus(value);
      return;
    }

    if (header === "priority") {
      record.priority = parsePriority(value);
      return;
    }

    record[header] = value;
  });

  return record;
}

function isStructuredHeaderRow(row: string[]) {
  const normalized = row.map((cell) => normalizeHeader(cell));
  return normalized.includes("company") && normalized.filter(Boolean).length >= 2;
}

function parseStructuredRows(rows: string[][]): SheetRowRecord[] {
  if (rows.length === 0 || !isStructuredHeaderRow(rows[0])) {
    return [];
  }

  const headers = rows[0].map((cell) => normalizeHeader(cell));
  const usableHeaders = headers.includes("company") ? headers : [];

  return rows
    .slice(1)
    .map((row) => buildRowRecord(usableHeaders, row))
    .filter((row) => Boolean(row.company));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCompanyKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeSearchQuery(value: string) {
  return encodeURIComponent(`${value} careers`);
}

function inferTags(company: string): string[] {
  const lower = company.toLowerCase();
  const tags = new Set<string>();

  if (EMBEDDED_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    tags.add("Embedded");
  }
  if (ROBOTICS_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    tags.add("Robotics");
  }
  if (AI_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    tags.add("AI/ML");
  }

  if (lower.includes("remote") || lower.includes("work from home")) {
    tags.add("Remote");
  }
  if (
    lower.includes("nvidia") ||
    lower.includes("apple") ||
    lower.includes("figure") ||
    lower.includes("anduril") ||
    lower.includes("zipline") ||
    lower.includes("applied intuition") ||
    lower.includes("tesla")
  ) {
    tags.add("California");
  }

  return [...tags];
}

function inferRoleKeywords(company: string): string[] {
  const lower = company.toLowerCase();

  if (lower.includes("robot")) return ["Robotics", "Autonomy", "Systems"];
  if (lower.includes("ai") || lower.includes("open")) return ["AI/ML", "Platform", "Engineering"];
  if (lower.includes("embedded") || lower.includes("chip") || lower.includes("semiconductor")) {
    return ["Embedded Systems", "Firmware", "Hardware"];
  }

  return [company, "Careers", "Engineering"];
}

function inferLocation(company: string): string {
  const lower = company.toLowerCase();

  if (
    lower.includes("nvidia") ||
    lower.includes("figure") ||
    lower.includes("anduril") ||
    lower.includes("apple") ||
    lower.includes("openai") ||
    lower.includes("zipline") ||
    lower.includes("tesla") ||
    lower.includes("applied intuition")
  ) {
    return "California";
  }

  if (lower.includes("remote")) {
    return "Remote";
  }

  return "Imported from Google Sheet";
}

function buildFallbackMeta(company: string): JobMeta {
  const tags = inferTags(company);
  const roleKeywords = inferRoleKeywords(company);

  return {
    careerUrl: `https://www.google.com/search?q=${escapeSearchQuery(company)}`,
    roleKeywords,
    status: "Saved",
    priority: tags.includes("Robotics") || tags.includes("Embedded") || tags.includes("AI/ML")
      ? "Medium"
      : "Low",
    notes: "Imported from the public Google Sheet.",
    tags: tags.length > 0 ? tags : ["Saved"],
    location: inferLocation(company),
  };
}

function buildMetaFromSheetRecord(record: SheetRowRecord, company: string): JobMeta {
  const fallback = buildFallbackMeta(company);
  const mergedTags = new Set([...(record.tags ?? []), ...fallback.tags]);
  const mergedRoleKeywords = record.roleKeywords?.length ? record.roleKeywords : fallback.roleKeywords;

  return {
    careerUrl: record.careerUrl || fallback.careerUrl,
    roleKeywords: mergedRoleKeywords,
    status: record.status || fallback.status,
    priority: record.priority || fallback.priority,
    notes: record.notes || fallback.notes,
    tags: [...mergedTags],
    location: record.location || fallback.location,
  };
}

function toJobCompany(company: string): JobCompany {
  const explicit =
    jobMetaByCompany[company] ??
    Object.entries(jobMetaByCompany).find(
      ([key]) => normalizeCompanyKey(key) === normalizeCompanyKey(company),
    )?.[1];
  const meta = explicit ?? buildFallbackMeta(company);
  const slug = slugify(company);

  return {
    id: slug,
    slug,
    company,
    careerUrl: meta.careerUrl,
    roleKeywords: meta.roleKeywords,
    status: meta.status,
    priority: meta.priority,
    notes: meta.notes,
    tags: meta.tags,
    location: meta.location,
  };
}

function toJobCompanyFromRecord(record: SheetRowRecord): JobCompany | null {
  const company = record.company?.trim();
  if (!company) {
    return null;
  }

  const explicit =
    jobMetaByCompany[company] ??
    Object.entries(jobMetaByCompany).find(
      ([key]) => normalizeCompanyKey(key) === normalizeCompanyKey(company),
    )?.[1];
  const meta = explicit
    ? {
        ...explicit,
        ...buildMetaFromSheetRecord(record, company),
      }
    : buildMetaFromSheetRecord(record, company);

  const slug = record.slug?.trim() || slugify(company);
  return {
    id: slug,
    slug,
    company,
    careerUrl: meta.careerUrl,
    roleKeywords: meta.roleKeywords,
    status: meta.status,
    priority: meta.priority,
    notes: meta.notes,
    tags: meta.tags,
    location: meta.location,
  };
}

export async function fetchJobsFromSheet(): Promise<JobsSheetResult> {
  try {
    const response = await fetch(SHEET_CSV_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Sheet fetch failed with ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCsv(csvText);
    const structuredRecords = parseStructuredRows(rows);
    const hasStructuredHeader = rows.length > 0 && isStructuredHeaderRow(rows[0]);

    if (structuredRecords.length > 0) {
      const structuredCompanies = new Map<string, JobCompany>();

      for (const record of structuredRecords) {
        const job = toJobCompanyFromRecord(record);
        if (!job) {
          continue;
        }

        structuredCompanies.set(normalizeCompanyKey(job.company), job);
      }

      if (structuredCompanies.size > 0) {
        return {
          jobs: [...structuredCompanies.values()],
          source: "sheet",
        };
      }
    }

    if (hasStructuredHeader) {
      const fallbackEntries = Object.keys(jobMetaByCompany).map((company) => toJobCompany(company));
      return {
        jobs: fallbackEntries,
        source: "fallback",
      };
    }

    const companies = new Map<string, JobCompany>();

    for (const row of rows) {
      for (const cell of row) {
        const company = cell.trim();
        const normalized = normalizeCompanyKey(company);
        if (!company || companies.has(normalized)) {
          continue;
        }
        companies.set(normalized, toJobCompany(company));
      }
    }

    return {
      jobs: companies.size > 0
        ? [...companies.values()]
        : Object.keys(jobMetaByCompany).map((company) => toJobCompany(company)),
      source: companies.size > 0 ? "sheet" : "fallback",
    };
  } catch {
    const fallbackEntries = Object.keys(jobMetaByCompany).map((company) => toJobCompany(company));
    return {
      jobs: fallbackEntries,
      source: "fallback",
    };
  }
}

export { parseCsv };
