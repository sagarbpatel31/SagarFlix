import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { blogDraftInputSchema } from "@/lib/blog-draft-input";
import { deserializeBlogDraft, serializeBlogDraft } from "@/lib/blog-draft-records";
import { prisma } from "@/lib/prisma";

const MAX_DRAFTS_PER_USER = 200;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const drafts = await prisma.blogDraft.findMany({
    where: { userId: session.user.id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    take: MAX_DRAFTS_PER_USER,
  });

  return NextResponse.json(drafts.map((draft) => deserializeBlogDraft(draft)));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = blogDraftInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid blog draft payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const draft = await prisma.blogDraft.create({
    data: serializeBlogDraft(parsed.data, session.user.id),
  });

  return NextResponse.json(deserializeBlogDraft(draft), { status: 201 });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Scoped to the caller, so the "clear all" action can never reach another
  // user's drafts.
  const { count } = await prisma.blogDraft.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true, count });
}
