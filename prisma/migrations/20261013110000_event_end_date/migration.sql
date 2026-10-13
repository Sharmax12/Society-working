-- Optional end date/time for multi-hour or multi-day events.
ALTER TABLE "Event" ADD COLUMN "endDate" TIMESTAMP(3);
