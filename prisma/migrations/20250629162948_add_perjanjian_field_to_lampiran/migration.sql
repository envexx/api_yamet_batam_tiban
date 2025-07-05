-- CreateEnum
CREATE TYPE "StatusJadwal" AS ENUM ('DIJADWALKAN', 'BERJALAN', 'SELESAI', 'IZIN', 'DIBATALKAN', 'DITUNDA');

-- CreateEnum
CREATE TYPE "StatusSesi" AS ENUM ('DIBATALKAN', 'SELESAI', 'BERJALAN', 'TIDAK_HADIR');

-- CreateEnum
CREATE TYPE "JenisTerapi" AS ENUM ('OT', 'BT', 'SI', 'TW');

-- AlterTable
ALTER TABLE "lampiran" ADD COLUMN     "perjanjian" TEXT;

-- CreateTable
CREATE TABLE "jadwal_terapi" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "terapis_id" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jam_mulai" TEXT NOT NULL,
    "jam_selesai" TEXT NOT NULL,
    "jenis_terapi" "JenisTerapi" NOT NULL,
    "status" "StatusJadwal" NOT NULL DEFAULT 'DIJADWALKAN',
    "catatan" TEXT,
    "alasan_izin" TEXT,
    "terapis_pengganti" INTEGER,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwal_terapi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesi_terapi" (
    "id" SERIAL NOT NULL,
    "jadwal_terapi_id" INTEGER,
    "anak_id" INTEGER NOT NULL,
    "terapis_id" INTEGER NOT NULL,
    "tanggal_sesi" TIMESTAMP(3) NOT NULL,
    "jam_mulai_aktual" TEXT NOT NULL,
    "jam_selesai_aktual" TEXT NOT NULL,
    "durasi_aktual" INTEGER NOT NULL,
    "jenis_terapi" "JenisTerapi" NOT NULL,
    "materi_sesi" TEXT,
    "hasil_sesi" TEXT,
    "catatan_terapis" TEXT,
    "status" "StatusSesi" NOT NULL DEFAULT 'SELESAI',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesi_terapi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_jadwal_mingguan" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "terapis_id" INTEGER NOT NULL,
    "hari_minggu" BOOLEAN NOT NULL DEFAULT false,
    "hari_senin" BOOLEAN NOT NULL DEFAULT false,
    "hari_selasa" BOOLEAN NOT NULL DEFAULT false,
    "hari_rabu" BOOLEAN NOT NULL DEFAULT false,
    "hari_kamis" BOOLEAN NOT NULL DEFAULT false,
    "hari_jumat" BOOLEAN NOT NULL DEFAULT false,
    "hari_sabtu" BOOLEAN NOT NULL DEFAULT false,
    "jam_mulai" TEXT NOT NULL,
    "jam_selesai" TEXT NOT NULL,
    "jenis_terapi" "JenisTerapi" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_jadwal_mingguan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jadwal_terapi" ADD CONSTRAINT "jadwal_terapi_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_terapi" ADD CONSTRAINT "jadwal_terapi_terapis_id_fkey" FOREIGN KEY ("terapis_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_terapi" ADD CONSTRAINT "jadwal_terapi_terapis_pengganti_fkey" FOREIGN KEY ("terapis_pengganti") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_terapi" ADD CONSTRAINT "jadwal_terapi_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi_terapi" ADD CONSTRAINT "sesi_terapi_jadwal_terapi_id_fkey" FOREIGN KEY ("jadwal_terapi_id") REFERENCES "jadwal_terapi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi_terapi" ADD CONSTRAINT "sesi_terapi_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi_terapi" ADD CONSTRAINT "sesi_terapi_terapis_id_fkey" FOREIGN KEY ("terapis_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi_terapi" ADD CONSTRAINT "sesi_terapi_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_jadwal_mingguan" ADD CONSTRAINT "template_jadwal_mingguan_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_jadwal_mingguan" ADD CONSTRAINT "template_jadwal_mingguan_terapis_id_fkey" FOREIGN KEY ("terapis_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_jadwal_mingguan" ADD CONSTRAINT "template_jadwal_mingguan_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
