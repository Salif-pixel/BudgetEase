/*
  Warnings:

  - Changed the type of `department` on the `requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL;
