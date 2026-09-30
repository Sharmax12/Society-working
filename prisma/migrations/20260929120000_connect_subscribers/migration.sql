CREATE TABLE "ConnectSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ConnectSubscriber_email_key" ON "ConnectSubscriber"("email");