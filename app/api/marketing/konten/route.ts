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

    // 1. Ide Konten berdasarkan Keluhan Terbanyak
    const keluhanData = await prisma.surveyAwal.findMany({
      where: {
        anak: { deleted_at: null }
      },
      select: {
        keluhan_orang_tua: true,
        anak: {
          select: {
            full_name: true,
            birth_date: true
          }
        }
      }
    });

    // Analisis keluhan untuk ide konten
    const keluhanCount: Record<string, number> = {};
    keluhanData.forEach(survey => {
      survey.keluhan_orang_tua.forEach(keluhan => {
        keluhanCount[keluhan] = (keluhanCount[keluhan] || 0) + 1;
      });
    });

    const ideKonten = Object.entries(keluhanCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keluhan, count]) => ({
        keluhan,
        frekuensi: count,
        ide_konten: generateIdeKonten(keluhan),
        target_audiens: getTargetAudiens(keluhan)
      }));

    // 2. Konten Sesuai Usia
    const usiaPasien = await prisma.anak.findMany({
      where: { deleted_at: null },
      select: {
        birth_date: true,
        survey_awal: {
          select: {
            keluhan_orang_tua: true
          }
        }
      }
    });

    const kontenSesuaiUsia = generateKontenSesuaiUsia(usiaPasien);

    // 3. Solusi Masalah berdasarkan Kendala
    const kendalaData = await prisma.surveyAwal.findMany({
      where: {
        anak: { deleted_at: null }
      },
      select: {
        kendala: true,
        tindakan_orang_tua: true
      }
    });

    const kendalaCount: Record<string, number> = {};
    kendalaData.forEach(survey => {
      survey.kendala.forEach(kendala => {
        kendalaCount[kendala] = (kendalaCount[kendala] || 0) + 1;
      });
    });

    const solusiMasalah = Object.entries(kendalaCount)
      .sort(([,a], [,b]) => b - a)
      .map(([kendala, count]) => ({
        kendala,
        frekuensi: count,
        solusi: generateSolusi(kendala),
        tips_marketing: generateTipsMarketing(kendala)
      }));

    // 4. Analisis Tindakan Orang Tua
    const tindakanCount: Record<string, number> = {};
    kendalaData.forEach(survey => {
      survey.tindakan_orang_tua.forEach(tindakan => {
        tindakanCount[tindakan] = (tindakanCount[tindakan] || 0) + 1;
      });
    });

    const analisisTindakan = Object.entries(tindakanCount)
      .sort(([,a], [,b]) => b - a)
      .map(([tindakan, count]) => ({
        tindakan,
        frekuensi: count,
        insight_marketing: generateInsightMarketing(tindakan)
      }));

    return createCorsResponse({
      status: 'success',
      message: 'Data konten marketing berhasil diambil',
      data: {
        ide_konten: ideKonten,
        konten_sesuai_usia: kontenSesuaiUsia,
        solusi_masalah: solusiMasalah,
        analisis_tindakan_orang_tua: analisisTindakan
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    console.error('Marketing konten error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// Helper functions untuk generate konten
function generateIdeKonten(keluhan: string): string {
  const ideKontenMap: Record<string, string> = {
    'Sulit bicara': 'Tips melatih kemampuan bicara anak usia dini',
    'Sering tantrum': 'Cara mengatasi tantrum anak dengan efektif',
    'Kurang konsentrasi': 'Latihan konsentrasi untuk anak hiperaktif',
    'Sulit makan': 'Strategi mengatasi anak picky eater',
    'Tidur tidak teratur': 'Tips mengatur pola tidur anak',
    'Sulit bersosialisasi': 'Cara membantu anak bersosialisasi',
    'Keterlambatan perkembangan': 'Tanda-tanda keterlambatan perkembangan yang perlu diperhatikan',
    'Masalah motorik': 'Latihan motorik halus dan kasar untuk anak',
    'Masalah emosional': 'Mengelola emosi anak dengan bijak',
    'Masalah belajar': 'Strategi belajar efektif untuk anak berkebutuhan khusus'
  };
  
  return ideKontenMap[keluhan] || `Konten edukasi tentang ${keluhan}`;
}

function getTargetAudiens(keluhan: string): string {
  const targetMap: Record<string, string> = {
    'Sulit bicara': 'Orang tua anak usia 2-5 tahun',
    'Sering tantrum': 'Orang tua anak usia 1-4 tahun',
    'Kurang konsentrasi': 'Orang tua anak usia 3-8 tahun',
    'Sulit makan': 'Orang tua anak usia 1-6 tahun',
    'Tidur tidak teratur': 'Orang tua bayi dan balita',
    'Sulit bersosialisasi': 'Orang tua anak usia 3-7 tahun',
    'Keterlambatan perkembangan': 'Orang tua anak usia 0-6 tahun',
    'Masalah motorik': 'Orang tua anak usia 2-8 tahun',
    'Masalah emosional': 'Orang tua anak usia 3-10 tahun',
    'Masalah belajar': 'Orang tua anak usia 5-12 tahun'
  };
  
  return targetMap[keluhan] || 'Orang tua anak berkebutuhan khusus';
}

function generateKontenSesuaiUsia(usiaPasien: any[]): any[] {
  const now = new Date();
  const usiaGroups: Record<string, any[]> = {
    '0-2 tahun': [],
    '3-5 tahun': [],
    '6-8 tahun': [],
    '9-12 tahun': []
  };

  usiaPasien.forEach(pasien => {
    if (pasien.birth_date) {
      const usia = now.getFullYear() - pasien.birth_date.getFullYear();
      if (usia <= 2) usiaGroups['0-2 tahun'].push(pasien);
      else if (usia <= 5) usiaGroups['3-5 tahun'].push(pasien);
      else if (usia <= 8) usiaGroups['6-8 tahun'].push(pasien);
      else if (usia <= 12) usiaGroups['9-12 tahun'].push(pasien);
    }
  });

  return Object.entries(usiaGroups).map(([rentang, pasien]) => ({
    rentang_usia: rentang,
    jumlah_pasien: pasien.length,
    konten_rekomendasi: generateKontenUsia(rentang),
    keluhan_umum: getKeluhanUmum(pasien)
  }));
}

function generateKontenUsia(rentang: string): string[] {
  const kontenMap: Record<string, string[]> = {
    '0-2 tahun': [
      'Stimulasi perkembangan bayi',
      'Tanda-tanda keterlambatan perkembangan',
      'Nutrisi untuk tumbuh kembang optimal'
    ],
    '3-5 tahun': [
      'Latihan kemampuan bicara dan bahasa',
      'Aktivitas motorik untuk balita',
      'Persiapan masuk sekolah'
    ],
    '6-8 tahun': [
      'Strategi belajar untuk anak SD',
      'Mengatasi masalah konsentrasi',
      'Pengembangan keterampilan sosial'
    ],
    '9-12 tahun': [
      'Mengelola emosi anak pra-remaja',
      'Strategi belajar efektif',
      'Persiapan masa pubertas'
    ]
  };
  
  return kontenMap[rentang] || ['Konten edukasi umum'];
}

function getKeluhanUmum(pasien: any[]): string[] {
  const keluhanCount: Record<string, number> = {};
  pasien.forEach(p => {
    p.survey_awal?.keluhan_orang_tua?.forEach((k: string) => {
      keluhanCount[k] = (keluhanCount[k] || 0) + 1;
    });
  });
  
  return Object.entries(keluhanCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([keluhan]) => keluhan);
}

function generateSolusi(kendala: string): string {
  const solusiMap: Record<string, string> = {
    'Biaya': 'Program terapi dengan biaya terjangkau dan cicilan',
    'Jarak jauh': 'Layanan terapi online dan home visit',
    'Waktu': 'Jadwal terapi yang fleksibel',
    'Stigma': 'Edukasi masyarakat tentang terapi anak',
    'Kurang informasi': 'Konsultasi gratis dan webinar edukasi',
    'Tidak ada dukungan keluarga': 'Program konseling keluarga',
    'Fasilitas terbatas': 'Kerjasama dengan berbagai fasilitas kesehatan'
  };
  
  return solusiMap[kendala] || `Solusi untuk mengatasi ${kendala}`;
}

function generateTipsMarketing(kendala: string): string {
  const tipsMap: Record<string, string> = {
    'Biaya': 'Highlight value for money, program cicilan, dan asuransi',
    'Jarak jauh': 'Promosikan layanan online dan home visit',
    'Waktu': 'Tampilkan jadwal fleksibel dan kemudahan booking',
    'Stigma': 'Konten edukasi dan testimoni sukses',
    'Kurang informasi': 'Konten edukasi gratis dan konsultasi online',
    'Tidak ada dukungan keluarga': 'Program konseling dan support group',
    'Fasilitas terbatas': 'Kerjasama dan referral program'
  };
  
  return tipsMap[kendala] || `Tips marketing untuk mengatasi ${kendala}`;
}

function generateInsightMarketing(tindakan: string): string {
  const insightMap: Record<string, string> = {
    'Sudah terapi': 'Target untuk program lanjutan dan maintenance',
    'Konsultasi dokter': 'Kerjasama dengan dokter dan referral program',
    'Mencari informasi': 'Konten edukasi dan SEO optimization',
    'Belum ada tindakan': 'Awareness campaign dan free consultation',
    'Mencoba alternatif': 'Highlight keunggulan dan testimoni',
    'Menunggu': 'Follow-up campaign dan reminder'
  };
  
  return insightMap[tindakan] || `Insight untuk tindakan ${tindakan}`;
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 