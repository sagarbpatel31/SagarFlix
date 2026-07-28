import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { blogGenerationInputSchema } from "@/lib/blog-generation-input";
import { resolveBlogGeneratorProvider } from "@/lib/blog-providers";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = blogGenerationInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid blog generation payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const resolution = resolveBlogGeneratorProvider();

  // The mock provider is free and local, so anonymous visitors can keep using it.
  // The OpenAI provider spends a real API budget, so it stays behind a session.
  if (resolution.name === "openai") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in to generate drafts with the OpenAI provider." },
        { status: 401 },
      );
    }
  }

  try {
    const result = await resolution.provider.generate(parsed.data);

    return NextResponse.json({
      result,
      provider: resolution.name,
      isFallback: resolution.isFallback,
    });
  } catch (cause) {
    console.error("Blog generation failed:", cause);
    return NextResponse.json({ error: "Blog generation failed." }, { status: 502 });
  }
}
