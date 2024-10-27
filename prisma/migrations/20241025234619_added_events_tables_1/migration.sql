-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('Invited', 'Accepted', 'Declined', 'Attended');

-- CreateTable
CREATE TABLE "Club" (
    "club_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "club_name" STRING NOT NULL,
    "description" STRING,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("club_id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "venue_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "venue_name" STRING NOT NULL,
    "location" STRING NOT NULL,
    "capacity" INT4 NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("venue_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "student_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "first_name" STRING NOT NULL,
    "last_name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "event_name" STRING NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "anticipated_attendees" INT4 NOT NULL,
    "club_id" INT8 NOT NULL,
    "venue_id" INT8 NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "Club_Membership" (
    "membership_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "membership_start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membership_status" "MembershipStatus" NOT NULL,
    "student_id" INT8 NOT NULL,
    "club_id" INT8 NOT NULL,

    CONSTRAINT "Club_Membership_pkey" PRIMARY KEY ("membership_id")
);

-- CreateTable
CREATE TABLE "Event_Participation" (
    "participation_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "status" "ParticipationStatus" NOT NULL,
    "event_id" INT8 NOT NULL,
    "student_id" INT8 NOT NULL,

    CONSTRAINT "Event_Participation_pkey" PRIMARY KEY ("participation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Club_Membership_student_id_club_id_key" ON "Club_Membership"("student_id", "club_id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_Participation_event_id_student_id_key" ON "Event_Participation"("event_id", "student_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("club_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "Venue"("venue_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club_Membership" ADD CONSTRAINT "Club_Membership_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club_Membership" ADD CONSTRAINT "Club_Membership_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("club_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Participation" ADD CONSTRAINT "Event_Participation_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Participation" ADD CONSTRAINT "Event_Participation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
