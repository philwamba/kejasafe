-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('fake_listing', 'inaccurate_info', 'suspicious_pricing', 'scam_or_fraud', 'duplicate_listing', 'inappropriate_content', 'already_taken', 'other');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "reporterUserId" UUID,
    "reporterEmail" TEXT,
    "reason" "ReportReason" NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'open',
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" UUID,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Report_propertyId_idx" ON "Report"("propertyId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
