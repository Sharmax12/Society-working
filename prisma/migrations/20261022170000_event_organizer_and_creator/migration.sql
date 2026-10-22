ALTER TABLE "Event"
  ADD COLUMN "organizerName" TEXT,
  ADD COLUMN "createdById" TEXT;

-- Preserve creator/organiser information for society-owned events.
UPDATE "Event" AS e
SET "createdById" = s."adminId",
    "organizerName" = s."name"
FROM "Society" AS s
WHERE e."societyId" = s."id";

ALTER TABLE "Event"
  ADD CONSTRAINT "Event_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");
