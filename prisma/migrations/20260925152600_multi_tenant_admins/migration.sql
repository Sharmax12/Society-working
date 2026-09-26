-- Add the platform-level role while preserving existing ADMIN accounts.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

-- A society can have multiple tenant-scoped administrators.
CREATE TABLE "SocietyAdmin" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocietyAdmin_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SocietyAdmin_societyId_userId_key"
ON "SocietyAdmin"("societyId", "userId");

CREATE INDEX "SocietyAdmin_userId_idx" ON "SocietyAdmin"("userId");
CREATE INDEX "SocietyAdmin_societyId_idx" ON "SocietyAdmin"("societyId");

ALTER TABLE "SocietyAdmin"
ADD CONSTRAINT "SocietyAdmin_societyId_fkey"
FOREIGN KEY ("societyId") REFERENCES "Society"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SocietyAdmin"
ADD CONSTRAINT "SocietyAdmin_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill the current primary society owner as a tenant admin.
-- The generated identifier only needs to be unique; it is stored as a String.
INSERT INTO "SocietyAdmin" ("id", "societyId", "userId")
SELECT
  'legacy_' || md5(s."id" || ':' || s."adminId"),
  s."id",
  s."adminId"
FROM "Society" s
WHERE NOT EXISTS (
  SELECT 1
  FROM "SocietyAdmin" sa
  WHERE sa."societyId" = s."id"
    AND sa."userId" = s."adminId"
);
