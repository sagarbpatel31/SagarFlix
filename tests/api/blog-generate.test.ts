import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSession = vi.hoisted(() => vi.fn());
const resolveBlogGeneratorProvider = vi.hoisted(() => vi.fn());
const generate = vi.hoisted(() => vi.fn());

vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/blog-providers", () => ({ resolveBlogGeneratorProvider }));

const { POST } = await import("@/app/api/blog/generate/route");

const validBody = {
  topic: "Simulation-first robotics workflows",
  tone: "Technical",
  format: "Blog",
};

const generatedResult = {
  title: "Simulation-First Robotics Workflows",
  summary: "A summary.",
  fullContent: "# Body",
  tags: ["Robotics"],
  socialPost: "A social post.",
};

function postRequest(body: unknown) {
  return new Request("http://localhost/api/blog/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function useProvider(name: "mock" | "openai", isFallback = false) {
  resolveBlogGeneratorProvider.mockReturnValue({ name, isFallback, provider: { generate } });
}

beforeEach(() => {
  vi.clearAllMocks();
  generate.mockResolvedValue(generatedResult);
  getServerSession.mockResolvedValue(null);
});

describe("POST /api/blog/generate", () => {
  it("generates with the mock provider without a session", async () => {
    useProvider("mock");

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      result: generatedResult,
      provider: "mock",
      isFallback: false,
    });
    expect(generate).toHaveBeenCalledWith(validBody);
    expect(getServerSession).not.toHaveBeenCalled();
  });

  it("requires a session before spending the OpenAI budget", async () => {
    useProvider("openai");

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(401);
    expect(generate).not.toHaveBeenCalled();
  });

  it("generates with the OpenAI provider for a signed-in user", async () => {
    useProvider("openai");
    getServerSession.mockResolvedValue({ user: { id: "user-1" } });

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ provider: "openai" });
  });

  it("reports the mock fallback when OpenAI is requested without a key", async () => {
    useProvider("mock", true);

    const response = await POST(postRequest(validBody));

    await expect(response.json()).resolves.toMatchObject({ provider: "mock", isFallback: true });
  });

  it("rejects an invalid payload before calling the provider", async () => {
    useProvider("mock");

    const response = await POST(postRequest({ topic: "", tone: "Technical", format: "Blog" }));

    expect(response.status).toBe(400);
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects a non-JSON body", async () => {
    useProvider("mock");

    const response = await POST(postRequest("not json"));

    expect(response.status).toBe(400);
    expect(generate).not.toHaveBeenCalled();
  });

  it("returns 502 when the provider throws", async () => {
    useProvider("mock");
    generate.mockRejectedValue(new Error("upstream exploded"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "Blog generation failed." });
  });
});
