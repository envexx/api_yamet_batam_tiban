-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'TERAPIS');

-- CreateEnum
CREATE TYPE "StatusAnak" AS ENUM ('AKTIF', 'CUTI', 'LULUS', 'BERHENTI');

-- CreateEnum
CREATE TYPE "TanganDominan" AS ENUM ('KANAN', 'KIRI');

-- CreateEnum
CREATE TYPE "StatusProgram" AS ENUM ('AKTIF', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "LevelKursus" AS ENUM ('PEMULA', 'MENENGAH', 'LANJUTAN');

-- CreateEnum
CREATE TYPE "JenisKelahiran" AS ENUM ('NORMAL', 'CAESAR');

-- CreateEnum
CREATE TYPE "PosisiBayi" AS ENUM ('KEPALA', 'KAKI');

-- CreateEnum
CREATE TYPE "PenolongPersalinan" AS ENUM ('DOKTER', 'BIDAN', 'DUKUN_BAYI');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TERAPIS',
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anak" (
    "id" SERIAL NOT NULL,
    "nomor_anak" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "nick_name" TEXT,
    "birth_date" TIMESTAMP(3),
    "birth_place" TEXT,
    "kewarganegaraan" TEXT,
    "agama" TEXT,
    "anak_ke" INTEGER,
    "sekolah_kelas" TEXT,
    "tanggal_pemeriksaan" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusAnak" NOT NULL DEFAULT 'AKTIF',
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "deleted_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_awal" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "mengetahui_yamet_dari" TEXT,
    "penjelasan_mekanisme" BOOLEAN,
    "bersedia_online" BOOLEAN,
    "keluhan_orang_tua" TEXT[],
    "tindakan_orang_tua" TEXT[],
    "kendala" TEXT[],

    CONSTRAINT "survey_awal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orang_tua" (
    "id" SERIAL NOT NULL,
    "anak_id_ayah" INTEGER,
    "anak_id_ibu" INTEGER,
    "nama" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "usia" INTEGER,
    "agama" TEXT,
    "alamat_rumah" TEXT,
    "anak_ke" INTEGER,
    "pernikahan_ke" INTEGER,
    "usia_saat_menikah" INTEGER,
    "pendidikan_terakhir" TEXT,
    "pekerjaan_saat_ini" TEXT,
    "telepon" TEXT,
    "email" TEXT,
    "tahun_meninggal" INTEGER,
    "usia_saat_meninggal" INTEGER,

    CONSTRAINT "orang_tua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_kehamilan" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "usia_ibu_saat_hamil" INTEGER,
    "usia_ayah_saat_hamil" INTEGER,
    "mual_sulit_makan" BOOLEAN,
    "asupan_gizi_memadai" BOOLEAN,
    "perawatan_kehamilan" BOOLEAN,
    "kehamilan_diinginkan" BOOLEAN,
    "berat_bayi_semester_normal" BOOLEAN,
    "diabetes" BOOLEAN,
    "hipertensi" BOOLEAN,
    "asma" BOOLEAN,
    "tbc" BOOLEAN,
    "merokok" BOOLEAN,
    "sekitar_perokok_berat" BOOLEAN,
    "konsumsi_alkohol" BOOLEAN,
    "konsumsi_obat_obatan" BOOLEAN,
    "infeksi_virus" BOOLEAN,
    "kecelakaan_trauma" BOOLEAN,
    "pendarahan_flek" BOOLEAN,
    "masalah_pernafasan" BOOLEAN,

    CONSTRAINT "riwayat_kehamilan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_kelahiran" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "jenis_kelahiran" "JenisKelahiran",
    "alasan_sc" TEXT,
    "bantuan_kelahiran" TEXT[],
    "is_premature" BOOLEAN,
    "usia_kelahiran_bulan" INTEGER,
    "posisi_bayi_saat_lahir" "PosisiBayi",
    "is_sungsang" BOOLEAN,
    "is_kuning" BOOLEAN,
    "detak_jantung_anak" TEXT,
    "apgar_score" TEXT,
    "lama_persalinan" TEXT,
    "penolong_persalinan" "PenolongPersalinan",
    "tempat_bersalin" TEXT,
    "cerita_spesifik_kelahiran" TEXT,

    CONSTRAINT "riwayat_kelahiran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_imunisasi" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "bgc" BOOLEAN,
    "hep_b1" BOOLEAN,
    "hep_b2" BOOLEAN,
    "hep_b3" BOOLEAN,
    "dpt_1" BOOLEAN,
    "dpt_2" BOOLEAN,
    "dpt_3" BOOLEAN,
    "dpt_booster_1" BOOLEAN,
    "polio_1" BOOLEAN,
    "polio_2" BOOLEAN,
    "polio_3" BOOLEAN,
    "polio_4" BOOLEAN,
    "polio_booster_1" BOOLEAN,
    "campak_1" BOOLEAN,
    "campak_2" BOOLEAN,
    "hib_1" BOOLEAN,
    "hib_2" BOOLEAN,
    "hib_3" BOOLEAN,
    "hib_4" BOOLEAN,
    "mmr_1" BOOLEAN,

    CONSTRAINT "riwayat_imunisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_setelah_lahir" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "asi_sampai_usia_bulan" INTEGER,
    "pernah_jatuh" BOOLEAN,
    "jatuh_usia_bulan" INTEGER,
    "jatuh_ketinggian_cm" INTEGER,
    "pernah_sakit_parah" BOOLEAN,
    "sakit_parah_usia_bulan" INTEGER,
    "pernah_panas_tinggi" BOOLEAN,
    "panas_tinggi_usia_bulan" INTEGER,
    "disertai_kejang" BOOLEAN,
    "frekuensi_durasi_kejang" TEXT,
    "pernah_kejang_tanpa_panas" BOOLEAN,
    "kejang_tanpa_panas_usia_bulan" INTEGER,
    "sakit_karena_virus" BOOLEAN,
    "sakit_virus_usia_bulan" INTEGER,
    "sakit_virus_jenis" TEXT,

    CONSTRAINT "riwayat_setelah_lahir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perkembangan_anak" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "tengkurap_ya" BOOLEAN,
    "tengkurap_usia" TEXT,
    "berguling_ya" BOOLEAN,
    "berguling_usia" TEXT,
    "duduk_ya" BOOLEAN,
    "duduk_usia" TEXT,
    "merayap_ya" BOOLEAN,
    "merayap_usia" TEXT,
    "merangkak_ya" BOOLEAN,
    "merangkak_usia" TEXT,
    "jongkok_ya" BOOLEAN,
    "jongkok_usia" TEXT,
    "transisi_berdiri_ya" BOOLEAN,
    "transisi_berdiri_usia" TEXT,
    "berdiri_tanpa_pegangan_ya" BOOLEAN,
    "berdiri_tanpa_pegangan_usia" TEXT,
    "berlari_ya" BOOLEAN,
    "berlari_usia" TEXT,
    "melompat_ya" BOOLEAN,
    "melompat_usia" TEXT,
    "reflek_vokalisasi_ya" BOOLEAN,
    "reflek_vokalisasi_usia" TEXT,
    "bubbling_ya" BOOLEAN,
    "bubbling_usia" TEXT,
    "lalling_ya" BOOLEAN,
    "lalling_usia" TEXT,
    "echolalia_ya" BOOLEAN,
    "echolalia_usia" TEXT,
    "true_speech_ya" BOOLEAN,
    "true_speech_usia" TEXT,
    "ungkap_keinginan_2_kata_ya" BOOLEAN,
    "ungkap_keinginan_2_kata_usia" TEXT,
    "bercerita_ya" BOOLEAN,
    "bercerita_usia" TEXT,
    "tertarik_lingkungan_luar_ya" BOOLEAN,
    "tertarik_lingkungan_luar_usia" TEXT,
    "digendong_siapapun_ya" BOOLEAN,
    "digendong_siapapun_usia" TEXT,
    "interaksi_timbal_balik_ya" BOOLEAN,
    "interaksi_timbal_balik_usia" TEXT,
    "komunikasi_ekspresi_ibu_ya" BOOLEAN,
    "komunikasi_ekspresi_ibu_usia" TEXT,
    "ekspresi_emosi_ya" BOOLEAN,
    "ekspresi_emosi_usia" TEXT,

    CONSTRAINT "perkembangan_anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perilaku_oral_motor" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "mengeces" BOOLEAN,
    "makan_makanan_keras" BOOLEAN,
    "makan_makanan_berkuah" BOOLEAN,
    "pilih_pilih_makanan" BOOLEAN,
    "makan_di_emut" BOOLEAN,
    "mengunyah_saat_makan" BOOLEAN,
    "makan_langsung_telan" BOOLEAN,

    CONSTRAINT "perilaku_oral_motor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pola_makan" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "pola_teratur" TEXT,
    "ada_pantangan_makanan" BOOLEAN,
    "pantangan_makanan" TEXT,
    "keterangan_lainnya" TEXT,

    CONSTRAINT "pola_makan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perkembangan_sosial" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "perilaku_bertemu_orang_baru" TEXT,
    "perilaku_bertemu_teman_sebaya" TEXT,
    "perilaku_bertemu_orang_lebih_tua" TEXT,
    "bermain_dengan_banyak_anak" TEXT,
    "keterangan_lainnya" TEXT,

    CONSTRAINT "perkembangan_sosial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pola_tidur" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "jam_tidur_teratur" BOOLEAN,
    "sering_terbangun" BOOLEAN,
    "jam_tidur_malam" TEXT,
    "jam_bangun_pagi" TEXT,

    CONSTRAINT "pola_tidur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penyakit_diderita" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "sakit_telinga" BOOLEAN,
    "sakit_telinga_usia_tahun" INTEGER,
    "sakit_telinga_penjelasan" TEXT,
    "sakit_mata" BOOLEAN,
    "sakit_mata_usia_tahun" INTEGER,
    "sakit_mata_penjelasan" TEXT,
    "luka_kepala" BOOLEAN,
    "luka_kepala_usia_tahun" INTEGER,
    "penyakit_lainnya" TEXT,

    CONSTRAINT "penyakit_diderita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hubungan_keluarga" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "tinggal_dengan" TEXT[],
    "tinggal_dengan_lainnya" TEXT,
    "hubungan_ayah_ibu" TEXT,
    "hubungan_ayah_anak" TEXT,
    "hubungan_ibu_anak" TEXT,
    "hubungan_saudara_dengan_anak" TEXT,
    "hubungan_nenek_kakek_dengan_anak" TEXT,
    "hubungan_saudara_ortu_dengan_anak" TEXT,
    "hubungan_pengasuh_dengan_anak" TEXT,

    CONSTRAINT "hubungan_keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_pendidikan" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "mulai_sekolah_formal_usia" TEXT,
    "mulai_sekolah_informal_usia" TEXT,
    "sekolah_formal_diikuti" TEXT,
    "sekolah_informal_diikuti" TEXT,
    "bimbingan_belajar" BOOLEAN,
    "belajar_membaca_sendiri" BOOLEAN,
    "belajar_dibacakan_ortu" BOOLEAN,
    "nilai_rata_rata_sekolah" TEXT,
    "nilai_tertinggi_mapel" TEXT,
    "nilai_tertinggi_nilai" TEXT,
    "nilai_terendah_mapel" TEXT,
    "nilai_terendah_nilai" TEXT,
    "keluhan_guru" TEXT[],

    CONSTRAINT "riwayat_pendidikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeriksaan_sebelumnya" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "tempat" TEXT,
    "usia" TEXT,
    "diagnosa" TEXT,

    CONSTRAINT "pemeriksaan_sebelumnya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terapi_sebelumnya" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "jenis_terapi" TEXT,
    "frekuensi" TEXT,
    "lama_terapi" TEXT,
    "tempat" TEXT,

    CONSTRAINT "terapi_sebelumnya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lampiran" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "hasil_eeg_url" TEXT,
    "hasil_bera_url" TEXT,
    "hasil_ct_scan_url" TEXT,
    "program_terapi_3bln_url" TEXT,
    "hasil_psikologis_psikiatris_url" TEXT,
    "keterangan_tambahan" TEXT,

    CONSTRAINT "lampiran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian_anak" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "assessment_date" TIMESTAMP(3) NOT NULL,
    "assessment_type" TEXT NOT NULL,
    "assessment_result" TEXT,
    "notes" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penilaian_anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_terapi" (
    "id" SERIAL NOT NULL,
    "anak_id" INTEGER NOT NULL,
    "program_name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "StatusProgram" NOT NULL DEFAULT 'AKTIF',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_terapi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kursus" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "level" "LevelKursus",
    "category" TEXT,
    "file_url" TEXT,
    "thumbnail_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kursus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ebook" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "description" TEXT,
    "category" TEXT,
    "file_url" TEXT,
    "cover_url" TEXT,
    "page_count" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ebook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "anak_nomor_anak_key" ON "anak"("nomor_anak");

-- CreateIndex
CREATE UNIQUE INDEX "survey_awal_anak_id_key" ON "survey_awal"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "orang_tua_anak_id_ayah_key" ON "orang_tua"("anak_id_ayah");

-- CreateIndex
CREATE UNIQUE INDEX "orang_tua_anak_id_ibu_key" ON "orang_tua"("anak_id_ibu");

-- CreateIndex
CREATE UNIQUE INDEX "riwayat_kehamilan_anak_id_key" ON "riwayat_kehamilan"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "riwayat_kelahiran_anak_id_key" ON "riwayat_kelahiran"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "riwayat_imunisasi_anak_id_key" ON "riwayat_imunisasi"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "riwayat_setelah_lahir_anak_id_key" ON "riwayat_setelah_lahir"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "perkembangan_anak_anak_id_key" ON "perkembangan_anak"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "perilaku_oral_motor_anak_id_key" ON "perilaku_oral_motor"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "pola_makan_anak_id_key" ON "pola_makan"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "perkembangan_sosial_anak_id_key" ON "perkembangan_sosial"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "pola_tidur_anak_id_key" ON "pola_tidur"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "penyakit_diderita_anak_id_key" ON "penyakit_diderita"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "hubungan_keluarga_anak_id_key" ON "hubungan_keluarga"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "riwayat_pendidikan_anak_id_key" ON "riwayat_pendidikan"("anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "lampiran_anak_id_key" ON "lampiran"("anak_id");

-- AddForeignKey
ALTER TABLE "anak" ADD CONSTRAINT "anak_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anak" ADD CONSTRAINT "anak_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anak" ADD CONSTRAINT "anak_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_awal" ADD CONSTRAINT "survey_awal_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_anak_id_ayah_fkey" FOREIGN KEY ("anak_id_ayah") REFERENCES "anak"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_anak_id_ibu_fkey" FOREIGN KEY ("anak_id_ibu") REFERENCES "anak"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_kehamilan" ADD CONSTRAINT "riwayat_kehamilan_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_kelahiran" ADD CONSTRAINT "riwayat_kelahiran_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_imunisasi" ADD CONSTRAINT "riwayat_imunisasi_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_setelah_lahir" ADD CONSTRAINT "riwayat_setelah_lahir_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perkembangan_anak" ADD CONSTRAINT "perkembangan_anak_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perilaku_oral_motor" ADD CONSTRAINT "perilaku_oral_motor_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pola_makan" ADD CONSTRAINT "pola_makan_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perkembangan_sosial" ADD CONSTRAINT "perkembangan_sosial_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pola_tidur" ADD CONSTRAINT "pola_tidur_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penyakit_diderita" ADD CONSTRAINT "penyakit_diderita_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hubungan_keluarga" ADD CONSTRAINT "hubungan_keluarga_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_pendidikan" ADD CONSTRAINT "riwayat_pendidikan_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_sebelumnya" ADD CONSTRAINT "pemeriksaan_sebelumnya_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapi_sebelumnya" ADD CONSTRAINT "terapi_sebelumnya_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lampiran" ADD CONSTRAINT "lampiran_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian_anak" ADD CONSTRAINT "penilaian_anak_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian_anak" ADD CONSTRAINT "penilaian_anak_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_terapi" ADD CONSTRAINT "program_terapi_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_terapi" ADD CONSTRAINT "program_terapi_anak_id_fkey" FOREIGN KEY ("anak_id") REFERENCES "anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kursus" ADD CONSTRAINT "kursus_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ebook" ADD CONSTRAINT "ebook_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
