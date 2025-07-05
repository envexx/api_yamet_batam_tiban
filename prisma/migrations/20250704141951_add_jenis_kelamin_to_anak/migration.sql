-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- AlterTable
ALTER TABLE "anak" ADD COLUMN     "jenis_kelamin" "JenisKelamin";
