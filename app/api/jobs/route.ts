import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jobApplicationInputSchema } from "@/lib/job-application-input";
import { prisma } from "@/lib/prisma";
import { deserializeJobApplication, serializeJobApplication } from "@/lib/job-applications";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.jobApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs.map((job) => deserializeJobApplication(job)));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = jobApplicationInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid job payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const job = await prisma.jobApplication.create({
    data: serializeJobApplication(parsed.data, session.user.id),
  });

  return NextResponse.json(deserializeJobApplication(job));
}
