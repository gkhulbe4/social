-- AlterTable
ALTER TABLE "public"."Chat" ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Chat_id_createdAt_idx" ON "public"."Chat"("id", "createdAt");
