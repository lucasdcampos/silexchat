-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'FILE');

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentHashedRefreshToken" TEXT;

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
