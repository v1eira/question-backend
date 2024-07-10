/*
  Warnings:

  - A unique constraint covering the columns `[questionId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_key" ON "Answer"("questionId");
