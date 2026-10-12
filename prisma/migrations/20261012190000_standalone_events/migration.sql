-- Allow community events that are not owned by a society.
ALTER TABLE "Event" ALTER COLUMN "societyId" DROP NOT NULL;

-- If a society is deleted, keep its event as a standalone community event.
ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_societyId_fkey";
ALTER TABLE "Event" ADD CONSTRAINT "Event_societyId_fkey"
  FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE SET NULL ON UPDATE CASCADE;
