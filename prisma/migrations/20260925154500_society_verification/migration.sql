CREATE TYPE "SocietyVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');

ALTER TABLE "Society"
ADD COLUMN "verificationStatus" "SocietyVerificationStatus" NOT NULL DEFAULT 'VERIFIED';

ALTER TABLE "Society"
ALTER COLUMN "verificationStatus" SET DEFAULT 'PENDING';
