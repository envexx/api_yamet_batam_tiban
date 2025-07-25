import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import { normalizeKeluhan, normalizeSumber, formatNormalizedData } from '../../../lib/data-normalizer';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Hanya SUPERADMIN dan MANAJER yang bisa akses
    if (!['SUPERADMIN', 'MANAJER'].includes(user.peran)) {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Hanya untuk superadmin dan manajer.' 
      }, 403, request);
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all|1month|4month|6month|1year
    const maxItems = parseInt(searchParams.get('maxItems') || '5');
    
    // Get current date
    const now = new Date();
    
    // Filter waktu berdasarkan period
    let filterStart: Date | null = null;
    
    if (period === '1month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (period === '4month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate());
    } else if (period === '6month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    } else if (period === '1year') {
      filterStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    
    // Build filter untuk anak
    const anakFilter: any = { deleted_at: null };
    if (filterStart) {
      anakFilter.created_at = { gte: filterStart };
    }
    
    // Ambil data keluhan dari survey awal
    const keluhanData = await prisma.surveyAwal.findMany({
      where: { anak: anakFilter },
      select: { keluhan_orang_tua: true }
    });
    
    // Hitung frekuensi keluhan
    const keluhanCount: Record<string, number> = {};
    keluhanData.forEach(survey => {
      survey.keluhan_orang_tua.forEach(keluhan => {
        if (keluhan && keluhan.trim()) {
          const key = keluhan.trim().toLowerCase();
          keluhanCount[key] = (keluhanCount[key] || 0) + 1;
        }
      });
    });
    
    // Convert ke format yang dibutuhkan normalizer
    const keluhanArray = Object.entries(keluhanCount).map(([keluhan, count]) => ({
      keluhan,
      count
    }));
    
    // Normalisasi keluhan
    const normalizedKeluhan = normalizeKeluhan(keluhanArray);
    
    // Ambil data sumber informasi
    const sumberData = await prisma.surveyAwal.findMany({
      where: { anak: anakFilter },
      select: { mengetahui_yamet_dari: true }
    });
    
    // Hitung frekuensi sumber
    const sumberCount: Record<string, number> = {};
    sumberData.forEach(survey => {
      if (survey.mengetahui_yamet_dari && survey.mengetahui_yamet_dari.trim()) {
        const key = survey.mengetahui_yamet_dari.trim().toLowerCase();
        sumberCount[key] = (sumberCount[key] || 0) + 1;
      }
    });
    
    // Convert ke format yang dibutuhkan normalizer
    const sumberArray = Object.entries(sumberCount).map(([sumber, count]) => ({
      sumber,
      count
    }));
    
    // Normalisasi sumber
    const normalizedSumber = normalizeSumber(sumberArray);
    
    // Hitung terapi berhasil
    const terapiBerhasil = await prisma.anak.count({
      where: {
        ...anakFilter,
        status: 'LULUS'
      }
    });
    
    // Hitung total anak
    const totalAnak = await prisma.anak.count({
      where: anakFilter
    });

    return createCorsResponse({
      status: 'success',
      message: 'Statistik normalisasi berhasil diambil',
      data: {
        period: period,
        filter_applied: filterStart ? filterStart.toISOString() : 'all_time',
        max_items: maxItems,
        top_keluhan: {
          raw_data: keluhanArray,
          normalized_data: normalizedKeluhan,
          formatted: formatNormalizedData(normalizedKeluhan, maxItems),
          summary: {
            total_unique_keluhan: keluhanArray.length,
            total_normalized_keluhan: normalizedKeluhan.length,
            top_keluhan: normalizedKeluhan.length > 0 ? normalizedKeluhan[0] : null
          }
        },
        sumber_informasi: {
          raw_data: sumberArray,
          normalized_data: normalizedSumber,
          formatted: formatNormalizedData(normalizedSumber, maxItems),
          summary: {
            total_unique_sumber: sumberArray.length,
            total_normalized_sumber: normalizedSumber.length,
            top_sumber: normalizedSumber.length > 0 ? normalizedSumber[0] : null
          }
        },
        terapi_berhasil: {
          jumlah_lulus: terapiBerhasil,
          total_anak: totalAnak,
          persentase_berhasil: totalAnak > 0 ? Math.round((terapiBerhasil / totalAnak) * 100 * 100) / 100 : 0
        }
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Token tidak valid.' 
      }, 401, request);
    }
    console.error('Normalized stats error:', error);
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 