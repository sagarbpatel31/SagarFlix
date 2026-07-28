import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { blogDraftUpdateSchema } from "@/lib/blog-draft-input";
import { deserializeBlogDraft, serializeBlogDraftUpdate } from "@/lib/blog-draft-records";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
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

  const parsed = blogDraftUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid blog draft update payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await params;

  // Drafts are addressed by an opaque id, so ownership is checked before the
  // write. A draft owned by someone else is reported as missing rather than
  // forbidden so the endpoint does not confirm that the id exists.
  const draft = await prisma.blogDraft.findUnique({ where: { id } });
  if (!draft || draft.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.blogDraft.update({
    where: { id },
    data: serializeBlogDraftUpdate(parsed.data),
  });

  return NextResponse.json(deserializeBlogDraft(updated));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const draft = await prisma.blogDraft.findUnique({ where: { id } });
  if (!draft || draft.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.blogDraft.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
