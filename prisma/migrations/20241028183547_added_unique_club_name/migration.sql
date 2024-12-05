/*
  Warnings:

  - A unique constraint covering the columns `[club_name]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Club_club_name_key" ON "Club"("club_name");
