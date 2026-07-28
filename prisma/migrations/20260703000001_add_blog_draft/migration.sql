-- CreateEnum
CREATE TYPE "BlogTone" AS ENUM ('Technical', 'Reflective', 'Direct', 'Founder');

-- CreateEnum
CREATE TYPE "BlogFormat" AS ENUM ('Blog', 'LinkedIn_Post', 'X_Thread');

-- CreateTable
CREATE TABLE "BlogDraft" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "tone" "BlogTone" NOT NULL,
    "format" "BlogFormat" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "fullContent" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "socialPost" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogDraft_userId_idx" ON "BlogDraft"("userId");

-- AddForeignKey
ALTER TABLE "BlogDraft" ADD CONSTRAINT "BlogDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
