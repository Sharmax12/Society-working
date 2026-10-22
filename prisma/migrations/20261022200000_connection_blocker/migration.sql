ALTER TABLE "Connection"
  ADD COLUMN "blockedById" TEXT;

ALTER TABLE "Connection"
  ADD CONSTRAINT "Connection_blockedById_fkey"
  FOREIGN KEY ("blockedById") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Connection_blockedById_idx" ON "Connection"("blockedById");
