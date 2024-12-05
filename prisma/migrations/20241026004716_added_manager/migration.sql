/*
  Warnings:

  - A unique constraint covering the columns `[manager_id]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "manager_id" INT8;

-- CreateIndex
CREATE UNIQUE INDEX "Club_manager_id_key" ON "Club"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Student"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
