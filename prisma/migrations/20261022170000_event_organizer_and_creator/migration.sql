ALTER TABLE "Event"
  ADD COLUMN "organizerName" TEXT,
  ADD COLUMN "createdById" TEXT;

-- Preserve creator/organiser information for society-owned events.
UPDATE "Event" AS e
SET "createdById" = s."adminId",
    "organizerName" = s."name"
FROM "Society" AS s
WHERE e."societyId" = s."id";

-- The previous standalone-event migration detached these legacy placeholder
-- societies from their events but left the placeholder society records public.
-- Suspend them rather than deleting historical records or applications.
UPDATE "Society"
SET "verificationStatus" = 'SUSPENDED',
    "isOpen" = FALSE,
    "updatedAt" = NOW()
WHERE "category" = 'General'
  AND "description" LIKE 'A community space for %'
  AND NOT EXISTS (
    SELECT 1 FROM "Event" AS e WHERE e."societyId" = "Society"."id"
  );

ALTER TABLE "Event"
  ADD CONSTRAINT "Event_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");
