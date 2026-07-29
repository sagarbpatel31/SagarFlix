/**
 * Reads a string list out of a text column.
 *
 * Both JobApplication and BlogDraft store arrays as JSON in a `String` column,
 * so both need the same compatibility shim: parse as JSON, and fall back to
 * comma-separated for rows written before that convention.
 */
export function parseList(value: string) {
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
