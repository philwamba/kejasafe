-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "ownershipDeclaredAt" TIMESTAMP(3),
ADD COLUMN     "responsibilityAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedByUserId" UUID,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
