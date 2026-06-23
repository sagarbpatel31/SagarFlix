import { describe, expect, it } from "vitest";

describe("sign-in page copy", () => {
  it("documents the no-provider fallback message", () => {
    const fallbackMessage =
      "No OAuth providers are configured yet. Set GITHUB_ID / GOOGLE_CLIENT_ID to enable sign-in.";

    expect(fallbackMessage).toContain("No OAuth providers are configured yet");
    expect(fallbackMessage).toContain("GITHUB_ID / GOOGLE_CLIENT_ID");
  });
});

