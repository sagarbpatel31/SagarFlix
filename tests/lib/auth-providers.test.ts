import { afterEach, describe, expect, it, vi } from "vitest";

function snapshotEnv() {
  return {
    githubId: process.env.GITHUB_ID,
    githubSecret: process.env.GITHUB_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

function restoreEnv(snapshot: ReturnType<typeof snapshotEnv>) {
  const entries: Array<[keyof ReturnType<typeof snapshotEnv>, string]> = [
    ["githubId", "GITHUB_ID"],
    ["githubSecret", "GITHUB_SECRET"],
    ["googleClientId", "GOOGLE_CLIENT_ID"],
    ["googleClientSecret", "GOOGLE_CLIENT_SECRET"],
  ];

  for (const [snapshotKey, envKey] of entries) {
    const value = snapshot[snapshotKey];
    if (value === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = value;
    }
  }
}

afterEach(() => {
  vi.resetModules();
});

describe("getAuthProviderConfigs", () => {
  it("returns no providers when env vars are missing", async () => {
    const snapshot = snapshotEnv();
    delete process.env.GITHUB_ID;
    delete process.env.GITHUB_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const { getAuthProviderConfigs } = await import("@/lib/auth-providers");
    expect(getAuthProviderConfigs()).toEqual([]);

    restoreEnv(snapshot);
  });

  it("ignores partially configured providers", async () => {
    const snapshot = snapshotEnv();
    process.env.GITHUB_ID = "github-id";
    delete process.env.GITHUB_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const { getAuthProviderConfigs } = await import("@/lib/auth-providers");
    expect(getAuthProviderConfigs()).toEqual([]);

    restoreEnv(snapshot);
  });

  it("returns only fully configured providers", async () => {
    const snapshot = snapshotEnv();
    process.env.GITHUB_ID = "github-id";
    process.env.GITHUB_SECRET = "github-secret";
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const { getAuthProviderConfigs } = await import("@/lib/auth-providers");
    const providers = getAuthProviderConfigs();

    expect(providers).toHaveLength(1);
    expect(providers[0]).toHaveProperty("id", "github");

    restoreEnv(snapshot);
  });

  it("returns Google when only Google is configured", async () => {
    const snapshot = snapshotEnv();
    delete process.env.GITHUB_ID;
    delete process.env.GITHUB_SECRET;
    process.env.GOOGLE_CLIENT_ID = "google-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-secret";

    const { getAuthProviderConfigs } = await import("@/lib/auth-providers");
    const providers = getAuthProviderConfigs();

    expect(providers).toHaveLength(1);
    expect(providers[0]).toHaveProperty("id", "google");

    restoreEnv(snapshot);
  });
});
