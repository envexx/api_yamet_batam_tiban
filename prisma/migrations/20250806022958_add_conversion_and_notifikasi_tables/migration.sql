-- CreateTable
CREATE TABLE "conversions" (
    "id" SERIAL NOT NULL,
    "jumlah_anak_keluar" INTEGER NOT NULL DEFAULT 0,
    "jumlah_leads" INTEGER NOT NULL DEFAULT 0,
    "jumlah_conversi" INTEGER NOT NULL DEFAULT 0,
    "bulan" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasis" (
    "id" SERIAL NOT NULL,
    "jenis_pemberitahuan" TEXT NOT NULL,
    "isi_notifikasi" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversions" ADD CONSTRAINT "conversions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversions" ADD CONSTRAINT "conversions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasis" ADD CONSTRAINT "notifikasis_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
