import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { blogDraftInputSchema } from "@/lib/blog-draft-input";
import { deserializeBlogDraft, serializeBlogDraft } from "@/lib/blog-draft-records";
import { MAX_REMOTE_DRAFTS, draftLimitMessage } from "@/lib/blog-draft-limits";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const drafts = await prisma.blogDraft.findMany({
    where: { userId: session.user.id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    take: MAX_REMOTE_DRAFTS,
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

  // Refusing is preferable to silently evicting an older draft: the drafts are
  // user-authored content, and deleting one to make room for another loses work
  // the user never agreed to give up.
  const stored = await prisma.blogDraft.count({ where: { userId: session.user.id } });

  if (stored >= MAX_REMOTE_DRAFTS) {
    return NextResponse.json(
      { error: draftLimitMessage(MAX_REMOTE_DRAFTS) },
      { status: 409 },
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
