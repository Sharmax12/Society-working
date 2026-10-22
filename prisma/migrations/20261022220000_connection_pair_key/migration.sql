-- Ensure there can be only one relationship row for each unordered pair.
-- If legacy rows exist in both directions, preserve the most restrictive/current
-- relationship before adding the unique canonical pair key. No messages or users
-- reference Connection.id, so redundant edge rows can be safely removed.
ALTER TABLE "Connection" ADD COLUMN "pairKey" VARCHAR(128);

WITH ranked AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY LEAST("requesterId", "recipientId"),
                   GREATEST("requesterId", "recipientId")
      ORDER BY
        CASE
          WHEN "status" = 'BLOCKED'::"ConnectionStatus" THEN 4
          WHEN "status" = 'ACCEPTED'::"ConnectionStatus" THEN 3
          WHEN "status" = 'PENDING'::"ConnectionStatus" THEN 2
          ELSE 1
        END DESC,
        "updatedAt" DESC,
        "createdAt" ASC,
        "id" ASC
    ) AS row_number
  FROM "Connection"
)
DELETE FROM "Connection" AS connection
USING ranked
WHERE connection."id" = ranked."id"
  AND ranked.row_number > 1;

UPDATE "Connection"
SET "pairKey" = CASE
  WHEN "requesterId" < "recipientId"
    THEN "requesterId" || ':' || "recipientId"
  ELSE "recipientId" || ':' || "requesterId"
END;

ALTER TABLE "Connection" ALTER COLUMN "pairKey" SET NOT NULL;
CREATE UNIQUE INDEX "Connection_pairKey_key" ON "Connection"("pairKey");
