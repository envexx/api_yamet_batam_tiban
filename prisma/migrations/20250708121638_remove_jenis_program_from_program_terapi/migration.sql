/*
  Warnings:

  - You are about to drop the column `custom_name` on the `program_terapi` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_program` on the `program_terapi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "program_terapi" DROP COLUMN "custom_name",
DROP COLUMN "jenis_program";
