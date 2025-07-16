import { NextRequest } from 'next/server';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../lib/cors';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (user.peran !== 'MARKETING') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Hanya untuk marketing.' }, 403, request);
    }

    // Ringkasan data untuk marketing
    const totalPasien = await prisma.anak.count({
      where: { deleted_at: null }
    });

    const pasienAktif = await prisma.anak.count({
      where: { 
        deleted_at: null,
        status: 'AKTIF'
      }
    });

    // Data keluhan untuk insight
    const keluhanData = await prisma.surveyAwal.findMany({
      where: {
        anak: { deleted_at: null }
      },
      select: {
        keluhan_orang_tua: true
      }
    });

    const keluhanCount: Record<string, number> = {};
    keluhanData.forEach(survey => {
      survey.keluhan_orang_tua.forEach(keluhan => {
        keluhanCount[keluhan] = (keluhanCount[keluhan] || 0) + 1;
      });
    });

    const topKeluhan = Object.entries(keluhanCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([keluhan, count]) => ({ keluhan, count }));

    // Data sumber informasi
    const sumberData = await prisma.surveyAwal.findMany({
      where: {
        anak: { deleted_at: null }
      },
      select: {
        mengetahui_yamet_dari: true
      }
    });

    const sumberCount: Record<string, number> = {};
    sumberData.forEach(survey => {
      if (survey.mengetahui_yamet_dari) {
        sumberCount[survey.mengetahui_yamet_dari] = (sumberCount[survey.mengetahui_yamet_dari] || 0) + 1;
      }
    });

    const topSumber = Object.entries(sumberCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sumber, count]) => ({ sumber, count }));

    // Menu yang tersedia untuk marketing
    const menuMarketing = [
      {
        nama: 'Dashboard',
        endpoint: '/api/marketing/dashboard',
        deskripsi: 'Ringkasan data pasien, keluhan terbanyak, data orang tua, pertumbuhan pasien',
        fitur: [
          'Ringkasan Data Pasien',
          'Keluhan Terbanyak',
          'Data Orang Tua',
          'Pertumbuhan Pasien'
        ]
      },
      {
        nama: 'Konten',
        endpoint: '/api/marketing/konten',
        deskripsi: 'Ide konten, konten sesuai usia, solusi masalah',
        fitur: [
          'Ide Konten',
          'Konten Sesuai Usia',
          'Solusi Masalah'
        ]
      },
      {
        nama: 'Target Audiens',
        endpoint: '/api/marketing/target-audiens',
        deskripsi: 'Profil pasien, tempat tinggal, pekerjaan',
        fitur: [
          'Profil Pasien',
          'Tempat Tinggal',
          'Pekerjaan Orang Tua'
        ]
      }
    ];

    return createCorsResponse({
      status: 'success',
      message: 'Data marketing berhasil diambil',
      data: {
        ringkasan: {
          total_pasien: totalPasien,
          pasien_aktif: pasienAktif,
          persentase_aktif: totalPasien > 0 ? Math.round((pasienAktif / totalPasien) * 100) : 0
        },
        insight_cepat: {
          keluhan_teratas: topKeluhan,
          sumber_informasi_teratas: topSumber
        },
        menu_tersedia: menuMarketing,
        rekomendasi_marketing: generateRekomendasiMarketing(topKeluhan, topSumber)
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    console.error('Marketing main error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

function generateRekomendasiMarketing(keluhan: any[], sumber: any[]) {
  const rekomendasi = {
    konten_prioritas: [] as string[],
    channel_marketing: [] as string[],
    target_audiens: [] as string[],
    strategi_konten: [] as string[]
  };

  // Rekomendasi berdasarkan keluhan
  keluhan.forEach(item => {
    switch (item.keluhan) {
      case 'Sulit bicara':
        rekomendasi.konten_prioritas.push('Tips melatih kemampuan bicara anak');
        rekomendasi.target_audiens.push('Orang tua anak usia 2-5 tahun');
        break;
      case 'Sering tantrum':
        rekomendasi.konten_prioritas.push('Cara mengatasi tantrum anak');
        rekomendasi.target_audiens.push('Orang tua anak usia 1-4 tahun');
        break;
      case 'Kurang konsentrasi':
        rekomendasi.konten_prioritas.push('Latihan konsentrasi untuk anak');
        rekomendasi.target_audiens.push('Orang tua anak usia 3-8 tahun');
        break;
      default:
        rekomendasi.konten_prioritas.push(`Konten tentang ${item.keluhan}`);
    }
  });

  // Rekomendasi berdasarkan sumber informasi
  sumber.forEach(item => {
    switch (item.sumber) {
      case 'Internet':
        rekomendasi.channel_marketing.push('SEO optimization', 'Website content');
        rekomendasi.strategi_konten.push('Blog posts', 'Video edukasi');
        break;
      case 'Sosial Media':
        rekomendasi.channel_marketing.push('Instagram', 'Facebook', 'TikTok');
        rekomendasi.strategi_konten.push('Short videos', 'Infographics');
        break;
      case 'Teman/Keluarga':
        rekomendasi.channel_marketing.push('Referral program', 'Word of mouth');
        rekomendasi.strategi_konten.push('Testimoni', 'Success stories');
        break;
      case 'Dokter':
        rekomendasi.channel_marketing.push('Partnership dengan dokter');
        rekomendasi.strategi_konten.push('Medical content', 'Expert interviews');
        break;
      default:
        rekomendasi.channel_marketing.push('Multi-channel approach');
    }
  });

  // Hapus duplikat
  rekomendasi.konten_prioritas = [...new Set(rekomendasi.konten_prioritas)];
  rekomendasi.channel_marketing = [...new Set(rekomendasi.channel_marketing)];
  rekomendasi.target_audiens = [...new Set(rekomendasi.target_audiens)];
  rekomendasi.strategi_konten = [...new Set(rekomendasi.strategi_konten)];

  return rekomendasi;
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 