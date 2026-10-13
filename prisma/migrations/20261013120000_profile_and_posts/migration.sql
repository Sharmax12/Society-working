ALTER TABLE "User"
  ADD COLUMN "profilePhoto" TEXT,
  ADD COLUMN "college" TEXT,
  ADD COLUMN "bio" TEXT;

CREATE TABLE "Post" (
  "id" TEXT NOT NULL,
  "content" VARCHAR(2000) NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

ALTER TABLE "Post"
  ADD CONSTRAINT "Post_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
