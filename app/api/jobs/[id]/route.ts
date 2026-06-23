import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jobApplicationUpdateSchema } from "@/lib/job-application-input";
import { prisma } from "@/lib/prisma";
import {
  deserializeJobApplication,
  serializeJobApplicationUpdate,
} from "@/lib/job-applications";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = jobApplicationUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid job update payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = serializeJobApplicationUpdate(parsed.data);

  const job = await prisma.jobApplication.findUnique({ where: { id } });
  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.jobApplication.update({
    where: { id },
    data,
  });

  return NextResponse.json(deserializeJobApplication(updated));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const job = await prisma.jobApplication.findUnique({ where: { id } });
  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.jobApplication.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
