import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (user.peran !== 'MARKETING') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Hanya untuk marketing.' }, 403, request);
    }

    // 1. Profil Pasien
    const profilPasien = await prisma.anak.findMany({
      where: { deleted_at: null },
      select: {
        full_name: true,
        birth_date: true,
        jenis_kelamin: true,
        status: true,
        survey_awal: {
          select: {
            keluhan_orang_tua: true,
            mengetahui_yamet_dari: true
          }
        },
        ayah: {
          select: {
            pendidikan_terakhir: true,
            pekerjaan_saat_ini: true,
            alamat_rumah: true
          }
        },
        ibu: {
          select: {
            pendidikan_terakhir: true,
            pekerjaan_saat_ini: true,
            alamat_rumah: true
          }
        }
      }
    });

    // Analisis profil pasien
    const analisisProfil = analyzeProfilPasien(profilPasien);

    // 2. Tempat Tinggal
    const tempatTinggal = await prisma.orangTua.findMany({
      where: {
        OR: [
          { anak_as_ayah: { deleted_at: null } },
          { anak_as_ibu: { deleted_at: null } }
        ]
      },
      select: {
        alamat_rumah: true,
        anak_as_ayah: {
          select: {
            full_name: true,
            status: true
          }
        },
        anak_as_ibu: {
          select: {
            full_name: true,
            status: true
          }
        }
      }
    });

    const analisisTempatTinggal = analyzeTempatTinggal(tempatTinggal);

    // 3. Pekerjaan Orang Tua
    const pekerjaanOrangTua = await prisma.orangTua.findMany({
      where: {
        OR: [
          { anak_as_ayah: { deleted_at: null } },
          { anak_as_ibu: { deleted_at: null } }
        ]
      },
      select: {
        pekerjaan_saat_ini: true,
        pendidikan_terakhir: true,
        anak_as_ayah: {
          select: {
            full_name: true,
            status: true
          }
        },
        anak_as_ibu: {
          select: {
            full_name: true,
            status: true
          }
        }
      }
    });

    const analisisPekerjaan = analyzePekerjaan(pekerjaanOrangTua);

    // 4. Analisis Sumber Informasi
    const sumberInformasi = await prisma.surveyAwal.findMany({
      where: {
        anak: { deleted_at: null }
      },
      select: {
        mengetahui_yamet_dari: true,
        anak: {
          select: {
            status: true
          }
        }
      }
    });

    const analisisSumberInfo = analyzeSumberInformasi(sumberInformasi);

    // 5. Segmentasi Target Audiens
    const segmentasiTarget = generateSegmentasiTarget(profilPasien);

    return createCorsResponse({
      status: 'success',
      message: 'Data target audiens marketing berhasil diambil',
      data: {
        profil_pasien: analisisProfil,
        tempat_tinggal: analisisTempatTinggal,
        pekerjaan_orang_tua: analisisPekerjaan,
        sumber_informasi: analisisSumberInfo,
        segmentasi_target: segmentasiTarget
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    console.error('Marketing target audiens error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// Helper functions
function analyzeProfilPasien(profilPasien: any[]) {
  const now = new Date();
  
  // Analisis usia
  const usiaCount: Record<string, number> = {
    '0-2 tahun': 0,
    '3-5 tahun': 0,
    '6-8 tahun': 0,
    '9-12 tahun': 0,
    '13+ tahun': 0
  };

  // Analisis jenis kelamin
  const genderCount: Record<string, number> = {
    'LAKI_LAKI': 0,
    'PEREMPUAN': 0
  };

  // Analisis status
  const statusCount: Record<string, number> = {
    'AKTIF': 0,
    'CUTI': 0,
    'BERHENTI': 0
  };

  // Analisis keluhan
  const keluhanCount: Record<string, number> = {};

  profilPasien.forEach(pasien => {
    // Usia
    if (pasien.birth_date) {
      const usia = now.getFullYear() - pasien.birth_date.getFullYear();
      if (usia <= 2) usiaCount['0-2 tahun']++;
      else if (usia <= 5) usiaCount['3-5 tahun']++;
      else if (usia <= 8) usiaCount['6-8 tahun']++;
      else if (usia <= 12) usiaCount['9-12 tahun']++;
      else usiaCount['13+ tahun']++;
    }

    // Jenis kelamin
    if (pasien.jenis_kelamin) {
      genderCount[pasien.jenis_kelamin]++;
    }

    // Status
    if (pasien.status) {
      statusCount[pasien.status]++;
    }

    // Keluhan
    pasien.survey_awal?.keluhan_orang_tua?.forEach((keluhan: string) => {
      keluhanCount[keluhan] = (keluhanCount[keluhan] || 0) + 1;
    });
  });

  return {
    distribusi_usia: Object.entries(usiaCount).map(([rentang, jumlah]) => ({ rentang, jumlah })),
    distribusi_gender: Object.entries(genderCount).map(([gender, jumlah]) => ({ gender, jumlah })),
    distribusi_status: Object.entries(statusCount).map(([status, jumlah]) => ({ status, jumlah })),
    keluhan_terbanyak: Object.entries(keluhanCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([keluhan, jumlah]) => ({ keluhan, jumlah }))
  };
}

function analyzeTempatTinggal(tempatTinggal: any[]) {
  const lokasiCount: Record<string, number> = {};
  const lokasiStatus: Record<string, { aktif: number; cuti: number; berhenti: number }> = {};

  tempatTinggal.forEach(ortu => {
    if (ortu.alamat_rumah) {
      // Ekstrak kota dari alamat
      const alamat = ortu.alamat_rumah.toLowerCase();
      let kota = 'Lainnya';
      
      if (alamat.includes('batam')) kota = 'Batam';
      else if (alamat.includes('jakarta')) kota = 'Jakarta';
      else if (alamat.includes('surabaya')) kota = 'Surabaya';
      else if (alamat.includes('bandung')) kota = 'Bandung';
      else if (alamat.includes('medan')) kota = 'Medan';
      else if (alamat.includes('semarang')) kota = 'Semarang';
      else if (alamat.includes('yogyakarta') || alamat.includes('jogja')) kota = 'Yogyakarta';
      else if (alamat.includes('makassar')) kota = 'Makassar';
      else if (alamat.includes('palembang')) kota = 'Palembang';
      else if (alamat.includes('manado')) kota = 'Manado';

      lokasiCount[kota] = (lokasiCount[kota] || 0) + 1;

      // Analisis status per lokasi
      if (!lokasiStatus[kota]) {
        lokasiStatus[kota] = { aktif: 0, cuti: 0, berhenti: 0 };
      }

      const status = ortu.anak_as_ayah?.status || ortu.anak_as_ibu?.status;
      if (status === 'AKTIF') lokasiStatus[kota].aktif++;
      else if (status === 'CUTI') lokasiStatus[kota].cuti++;
      else if (status === 'BERHENTI') lokasiStatus[kota].berhenti++;
    }
  });

  return {
    distribusi_lokasi: Object.entries(lokasiCount)
      .sort(([,a], [,b]) => b - a)
      .map(([kota, jumlah]) => ({ kota, jumlah })),
    status_per_lokasi: Object.entries(lokasiStatus).map(([kota, status]) => ({
      kota,
      ...status
    }))
  };
}

function analyzePekerjaan(pekerjaanOrangTua: any[]) {
  const pekerjaanCount: Record<string, number> = {};
  const pendidikanCount: Record<string, number> = {};
  const pekerjaanStatus: Record<string, { aktif: number; cuti: number; berhenti: number }> = {};

  pekerjaanOrangTua.forEach(ortu => {
    if (ortu.pekerjaan_saat_ini) {
      pekerjaanCount[ortu.pekerjaan_saat_ini] = (pekerjaanCount[ortu.pekerjaan_saat_ini] || 0) + 1;

      // Analisis status per pekerjaan
      if (!pekerjaanStatus[ortu.pekerjaan_saat_ini]) {
        pekerjaanStatus[ortu.pekerjaan_saat_ini] = { aktif: 0, cuti: 0, berhenti: 0 };
      }

      const status = ortu.anak_as_ayah?.status || ortu.anak_as_ibu?.status;
      if (status === 'AKTIF') pekerjaanStatus[ortu.pekerjaan_saat_ini].aktif++;
      else if (status === 'CUTI') pekerjaanStatus[ortu.pekerjaan_saat_ini].cuti++;
      else if (status === 'BERHENTI') pekerjaanStatus[ortu.pekerjaan_saat_ini].berhenti++;
    }

    if (ortu.pendidikan_terakhir) {
      pendidikanCount[ortu.pendidikan_terakhir] = (pendidikanCount[ortu.pendidikan_terakhir] || 0) + 1;
    }
  });

  return {
    distribusi_pekerjaan: Object.entries(pekerjaanCount)
      .sort(([,a], [,b]) => b - a)
      .map(([pekerjaan, jumlah]) => ({ pekerjaan, jumlah })),
    distribusi_pendidikan: Object.entries(pendidikanCount)
      .sort(([,a], [,b]) => b - a)
      .map(([pendidikan, jumlah]) => ({ pendidikan, jumlah })),
    status_per_pekerjaan: Object.entries(pekerjaanStatus).map(([pekerjaan, status]) => ({
      pekerjaan,
      ...status
    }))
  };
}

function analyzeSumberInformasi(sumberInformasi: any[]) {
  const sumberCount: Record<string, number> = {};
  const sumberStatus: Record<string, { aktif: number; cuti: number; berhenti: number }> = {};

  sumberInformasi.forEach(survey => {
    if (survey.mengetahui_yamet_dari) {
      sumberCount[survey.mengetahui_yamet_dari] = (sumberCount[survey.mengetahui_yamet_dari] || 0) + 1;

      // Analisis status per sumber
      if (!sumberStatus[survey.mengetahui_yamet_dari]) {
        sumberStatus[survey.mengetahui_yamet_dari] = { aktif: 0, cuti: 0, berhenti: 0 };
      }

      const status = survey.anak?.status;
      if (status === 'AKTIF') sumberStatus[survey.mengetahui_yamet_dari].aktif++;
      else if (status === 'CUTI') sumberStatus[survey.mengetahui_yamet_dari].cuti++;
      else if (status === 'BERHENTI') sumberStatus[survey.mengetahui_yamet_dari].berhenti++;
    }
  });

  return {
    distribusi_sumber: Object.entries(sumberCount)
      .sort(([,a], [,b]) => b - a)
      .map(([sumber, jumlah]) => ({ sumber, jumlah })),
    status_per_sumber: Object.entries(sumberStatus).map(([sumber, status]) => ({
      sumber,
      ...status
    }))
  };
}

function generateSegmentasiTarget(profilPasien: any[]) {
  const now = new Date();
  
  // Segmentasi berdasarkan usia anak
  const segmentasiUsia: Record<string, any> = {
    'Bayi (0-2 tahun)': {
      karakteristik: 'Orang tua baru, mencari informasi perkembangan',
      konten_rekomendasi: ['Stimulasi bayi', 'Tanda-tanda keterlambatan', 'Nutrisi'],
      channel_marketing: ['Instagram', 'Facebook', 'YouTube'],
      budget_estimasi: 'Menengah ke atas'
    },
    'Balita (3-5 tahun)': {
      karakteristik: 'Orang tua aktif mencari solusi masalah perkembangan',
      konten_rekomendasi: ['Latihan bicara', 'Aktivitas motorik', 'Persiapan sekolah'],
      channel_marketing: ['Instagram', 'TikTok', 'WhatsApp'],
      budget_estimasi: 'Menengah'
    },
    'Anak SD (6-8 tahun)': {
      karakteristik: 'Orang tua fokus pada masalah belajar dan sosialisasi',
      konten_rekomendasi: ['Strategi belajar', 'Konsentrasi', 'Sosialisasi'],
      channel_marketing: ['Facebook', 'Instagram', 'Website'],
      budget_estimasi: 'Menengah ke bawah'
    },
    'Pra-remaja (9-12 tahun)': {
      karakteristik: 'Orang tua menghadapi masalah emosional dan akademik',
      konten_rekomendasi: ['Manajemen emosi', 'Strategi belajar', 'Persiapan pubertas'],
      channel_marketing: ['Website', 'Email', 'Facebook'],
      budget_estimasi: 'Menengah'
    }
  };

  // Hitung distribusi usia untuk segmentasi
  const usiaDist: Record<string, number> = {};
  profilPasien.forEach(pasien => {
    if (pasien.birth_date) {
      const usia = now.getFullYear() - pasien.birth_date.getFullYear();
      if (usia <= 2) usiaDist['Bayi (0-2 tahun)'] = (usiaDist['Bayi (0-2 tahun)'] || 0) + 1;
      else if (usia <= 5) usiaDist['Balita (3-5 tahun)'] = (usiaDist['Balita (3-5 tahun)'] || 0) + 1;
      else if (usia <= 8) usiaDist['Anak SD (6-8 tahun)'] = (usiaDist['Anak SD (6-8 tahun)'] || 0) + 1;
      else if (usia <= 12) usiaDist['Pra-remaja (9-12 tahun)'] = (usiaDist['Pra-remaja (9-12 tahun)'] || 0) + 1;
    }
  });

  // Tambahkan jumlah ke setiap segmentasi
  Object.keys(segmentasiUsia).forEach(segment => {
    segmentasiUsia[segment].jumlah_pasien = usiaDist[segment] || 0;
  });

  return segmentasiUsia;
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 