import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../lib/auth";

export async function GET(req: NextRequest) {
  // 1. Cek API Key di header
  const apiKey = req.headers.get("x-gemini-api-key");
  if (apiKey !== process.env.GEMINI_DATA_API_KEY) {
    return NextResponse.json({ error: "Unauthorized (API Key)" }, { status: 401 });
  }

  // 2. Cek Auth Header (JWT Bearer Token)
  try {
    requireAuth(req); // Akan throw error jika tidak valid
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized (Login required)" }, { status: 401 });
  }

  // 2. Ambil seluruh data dari semua tabel utama
  const [anak, user, role, program_terapi, penilaian, lampiran, jadwal_terapi, sesi_terapi, template_jadwal_mingguan, orang_tua, survey_awal, riwayat_kehamilan, riwayat_kelahiran, riwayat_imunisasi, riwayat_setelah_lahir, perkembangan_anak, perilaku_oral_motor, pola_makan, perkembangan_sosial, pola_tidur, penyakit_diderita, hubungan_keluarga, riwayat_pendidikan, pemeriksaan_sebelumnya, terapi_sebelumnya, kursus, ebook] = await Promise.all([
    prisma.anak.findMany({ include: { program_terapi: true, penilaian: true, lampiran: true, jadwal_terapi: true, sesi_terapi: true, template_jadwal_mingguan: true } }),
    prisma.user.findMany({ include: { role: true } }),
    prisma.role.findMany(),
    prisma.programTerapi.findMany(),
    prisma.penilaianAnak.findMany(),
    prisma.lampiran.findMany(),
    prisma.jadwalTerapi.findMany(),
    prisma.sesiTerapi.findMany(),
    prisma.templateJadwalMingguan.findMany(),
    prisma.orangTua.findMany(),
    prisma.surveyAwal.findMany(),
    prisma.riwayatKehamilan.findMany(),
    prisma.riwayatKelahiran.findMany(),
    prisma.riwayatImunisasi.findMany(),
    prisma.riwayatSetelahLahir.findMany(),
    prisma.perkembanganAnak.findMany(),
    prisma.perilakuOralMotor.findMany(),
    prisma.polaMakan.findMany(),
    prisma.perkembanganSosial.findMany(),
    prisma.polaTidur.findMany(),
    prisma.penyakitDiderita.findMany(),
    prisma.hubunganKeluarga.findMany(),
    prisma.riwayatPendidikan.findMany(),
    prisma.pemeriksaanSebelumnya.findMany(),
    prisma.terapiSebelumnya.findMany(),
    prisma.kursus.findMany(),
    prisma.ebook.findMany(),
  ]);

  // 3. Kembalikan seluruh data dalam format JSON
  return NextResponse.json({
    anak,
    user,
    role,
    program_terapi,
    penilaian,
    lampiran,
    jadwal_terapi,
    sesi_terapi,
    template_jadwal_mingguan,
    orang_tua,
    survey_awal,
    riwayat_kehamilan,
    riwayat_kelahiran,
    riwayat_imunisasi,
    riwayat_setelah_lahir,
    perkembangan_anak,
    perilaku_oral_motor,
    pola_makan,
    perkembangan_sosial,
    pola_tidur,
    penyakit_diderita,
    hubungan_keluarga,
    riwayat_pendidikan,
    pemeriksaan_sebelumnya,
    terapi_sebelumnya,
    kursus,
    ebook,
  });
} 