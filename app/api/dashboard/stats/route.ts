import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import { normalizeKeluhan, normalizeSumber, formatNormalizedData } from '../../../lib/data-normalizer';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN', 'MANAJER'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403, request);
    }
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // month|quarter|year
    
    // Get current date
    const now = new Date();
    
    // --- FILTERING DINAMIS BERDASARKAN PERIOD ---
    let filterStart: Date | null = null;
    let filterEnd: Date | null = null;
    
    if (period === '1month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (period === '4month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate());
    } else if (period === '6month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    } else if (period === '1year') {
      filterStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else if (period === 'all') {
      // Tidak ada filter waktu untuk semua data
      filterStart = null;
    } else { // default 1month
      filterStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    
    // --- FILTER UNTUK ANAK, TERAPI, ASSESSMENT, SESI, DLL ---
    const anakFilter: any = { deleted_at: null };
    const penilaianFilter: any = {};
    const programFilter: any = {};
    const sesiFilter: any = {};
    
    if (filterStart) {
      anakFilter.tanggal_pemeriksaan = { gte: filterStart };
      penilaianFilter.assessment_date = { gte: filterStart };
      programFilter.start_date = { gte: filterStart };
      sesiFilter.tanggal_sesi = { gte: filterStart };
    }
    
    // --- User statistics ---
    const totalAdmins = await prisma.user.count({ 
      where: { 
        status: 'active', 
        role: { name: 'ADMIN' } 
      } 
    });
    const totalTerapis = await prisma.user.count({ 
      where: { 
        status: 'active', 
        role: { name: 'TERAPIS' } 
      } 
    });
    const totalManajer = await prisma.user.count({ 
      where: { 
        status: 'active', 
        role: { name: 'MANAJER' } 
      } 
    });
    const totalOrangTua = await prisma.user.count({ 
      where: { 
        status: 'active', 
        role: { name: 'ORANGTUA' } 
      } 
    });
    
    // --- STATISTIK INPUTAN ADMIN ---
    // Ambil semua admin yang aktif
    const adminUsers = await prisma.user.findMany({
      where: { 
        status: 'active', 
        role: { name: 'ADMIN' } 
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    // Hitung jumlah inputan per admin
    const adminInputStats = await Promise.all(
      adminUsers.map(async (admin) => {
        const [
          anakCount,
          penilaianCount,
          programCount,
          jadwalCount,
          sesiCount,
          ebookCount,
          kursusCount
        ] = await Promise.all([
          // Jumlah anak yang dibuat oleh admin ini
          prisma.anak.count({
            where: { 
              created_by: admin.id,
              deleted_at: null
            }
          }),
          
          // Jumlah penilaian yang dibuat oleh admin ini
          prisma.penilaianAnak.count({
            where: { created_by: admin.id }
          }),
          
          // Jumlah program terapi yang dibuat oleh admin ini
          prisma.programTerapi.count({
            where: { created_by: admin.id }
          }),
          
          // Jumlah jadwal terapi yang dibuat oleh admin ini
          prisma.jadwalTerapi.count({
            where: { created_by: admin.id }
          }),
          
          // Jumlah sesi terapi yang dibuat oleh admin ini
          prisma.sesiTerapi.count({
            where: { created_by: admin.id }
          }),
          
          // Jumlah ebook yang dibuat oleh admin ini
          prisma.ebook.count({
            where: { created_by: admin.id }
          }),
          
          // Jumlah kursus yang dibuat oleh admin ini
          prisma.kursus.count({
            where: { created_by: admin.id }
          })
        ]);
        
        const totalInput = anakCount + penilaianCount + programCount + jadwalCount + sesiCount + ebookCount + kursusCount;
        
        return {
          admin_id: admin.id,
          admin_name: admin.name,
          admin_email: admin.email,
          total_input: totalInput,
          detail: {
            anak: anakCount,
            penilaian: penilaianCount,
            program_terapi: programCount,
            jadwal_terapi: jadwalCount,
            sesi_terapi: sesiCount,
            ebook: ebookCount,
            kursus: kursusCount
          }
        };
      })
    );
    
    // Urutkan berdasarkan total input (descending)
    adminInputStats.sort((a, b) => b.total_input - a.total_input);
    
    // --- TOTAL ANAK (tanpa filter waktu) ---
    const totalAnak = await prisma.anak.count({ where: { deleted_at: null } });
    
    // --- Anak keluar bulan lalu ---
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const anakKeluarBulanLalu = await prisma.anak.count({
      where: {
        deleted_at: null,
        status: { in: ['BERHENTI', 'LULUS'] },
        selesai_terapi: { gte: lastMonth, lte: lastMonthEnd },
      },
    });
    
    // --- ANAK KELUAR BULAN INI ---
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const anakKeluarBulanIni = await prisma.anak.count({
      where: {
        deleted_at: null,
        status: { in: ['BERHENTI', 'LULUS'] },
        selesai_terapi: { gte: thisMonthStart, lte: thisMonthEnd },
      },
    });
    
    // --- ANAK AKTIF ---
    const anakAktif = await prisma.anak.count({ where: { deleted_at: null, status: 'AKTIF' } });
    
    // --- CONVERSION DATA ---
    const conversionData = await prisma.conversion.findMany({
      include: {
        user_created: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        user_updated: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    // Hitung total conversion
    const totalConversion = conversionData.length;
    const totalLeads = conversionData.reduce((sum, item) => sum + item.jumlah_leads, 0);
    const totalAnakKeluar = conversionData.reduce((sum, item) => sum + item.jumlah_anak_keluar, 0);
    const totalConversi = conversionData.reduce((sum, item) => sum + item.jumlah_conversi, 0);
    
    // Conversion rate
    const conversionRate = totalLeads > 0 ? (totalConversi / totalLeads) * 100 : 0;
    
    // --- GROWTH: Kumpulkan seluruh data anak berdasarkan tanggal_pemeriksaan ---
    const growthWhere: any = { 
      deleted_at: null, 
      tanggal_pemeriksaan: { not: null }
    };
    
    if (filterStart) {
      growthWhere.tanggal_pemeriksaan.gte = filterStart;
    }
    
    const allGrowthData = await prisma.anak.findMany({
      where: growthWhere,
      select: { tanggal_pemeriksaan: true },
    });
    
    // Group data berdasarkan period yang dipilih
    const growthData: any[] = [];
    
    if (period === '1month') {
      // 1 bulan terakhir (per minggu)
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
        const weekName = `Minggu ${4 - i}`;
        const count = allGrowthData.filter(a => {
          const anakDate = a.tanggal_pemeriksaan!;
          const weekDiff = Math.floor((now.getTime() - anakDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          return weekDiff >= (i * 7) && weekDiff < ((i + 1) * 7);
        }).length;
        growthData.push({ period: weekName, count });
      }
    } else if (period === '4month') {
      // 4 bulan terakhir (per bulan)
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        const count = allGrowthData.filter(a => {
          const anakDate = a.tanggal_pemeriksaan!;
          return anakDate.getMonth() === date.getMonth() && 
                 anakDate.getFullYear() === date.getFullYear();
        }).length;
        growthData.push({ period: monthName, count });
      }
    } else if (period === '6month') {
      // 6 bulan terakhir (per bulan)
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        const count = allGrowthData.filter(a => {
          const anakDate = a.tanggal_pemeriksaan!;
          return anakDate.getMonth() === date.getMonth() && 
                 anakDate.getFullYear() === date.getFullYear();
        }).length;
        growthData.push({ period: monthName, count });
      }
    } else if (period === '1year') {
      // 1 tahun terakhir (per bulan)
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        const count = allGrowthData.filter(a => {
          const anakDate = a.tanggal_pemeriksaan!;
          return anakDate.getMonth() === date.getMonth() && 
                 anakDate.getFullYear() === date.getFullYear();
        }).length;
        growthData.push({ period: monthName, count });
      }
    } else if (period === 'all') {
      // Semua waktu (per tahun)
      const years = [...new Set(allGrowthData.map(a => a.tanggal_pemeriksaan!.getFullYear()))].sort();
      years.forEach(year => {
        const count = allGrowthData.filter(a => {
          const anakDate = a.tanggal_pemeriksaan!;
          return anakDate.getFullYear() === year;
        }).length;
        growthData.push({ period: year.toString(), count });
      });
    } else {
      // Default: 1 bulan terakhir (per minggu)
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
        const weekName = `Minggu ${4 - i}`;
        const count = allGrowthData.filter(a => {
          const anakDate = a.tanggal_pemeriksaan!;
          const weekDiff = Math.floor((now.getTime() - anakDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          return weekDiff >= (i * 7) && weekDiff < ((i + 1) * 7);
        }).length;
        growthData.push({ period: weekName, count });
      }
    }

    // --- INSIGHT KLINIS & DIAGNOSIS ---
    // Pola Keluhan Utama - TAMPILKAN SEMUA DATA (tanpa filter waktu)
    const keluhanUtama = await prisma.surveyAwal.findMany({
      select: { keluhan_orang_tua: true },
      where: { anak: { deleted_at: null } }, // Hanya filter deleted_at, tidak ada filter waktu
    });
    const keluhanCount: Record<string, number> = {};
    keluhanUtama.forEach(item => {
      (item.keluhan_orang_tua || []).forEach(keluhan => {
        if (!keluhan) return;
        const key = keluhan.trim().toLowerCase();
        keluhanCount[key] = (keluhanCount[key] || 0) + 1;
      });
    });
    // Top 3 keluhan
    const topKeluhan = Object.entries(keluhanCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([keluhan, count]) => ({ keluhan, count }));

    // --- NORMALISASI DATA KELUHAN ---
    // Convert ke format yang dibutuhkan normalizer
    const keluhanArray = Object.entries(keluhanCount).map(([keluhan, count]) => ({
      keluhan,
      count
    }));
    
    // Normalisasi keluhan
    const normalizedKeluhan = normalizeKeluhan(keluhanArray);
    const formattedKeluhan = formatNormalizedData(normalizedKeluhan, 5);

    // Milestone Development Analysis
    const milestoneData = await prisma.perkembanganAnak.findMany({
      select: { anak_id: true, tengkurap_usia: true, duduk_usia: true, merangkak_usia: true, berdiri_tanpa_pegangan_usia: true, berlari_usia: true },
      where: { anak: anakFilter },
    });
    // Kelompok usia: <2, 2-4, 4-6, >6 tahun
    const milestoneDelay: Record<string, number> = { '<2': 0, '2-4': 0, '4-6': 0, '>6': 0 };
    for (const m of milestoneData) {
      // Dummy logic: jika milestone usia > normal, hitung delay (bisa disesuaikan)
      // Normal: tengkurap <6bln, duduk <9bln, merangkak <12bln, berdiri <15bln, berjalan <18bln
      // Asumsi usia format "3 bulan", "2 tahun", dst
      // (implementasi detail bisa diperbaiki sesuai data real)
      // ...
    }
    // Risk Factor Correlation
    const riskData = await prisma.riwayatKehamilan.findMany({
      select: { anak_id: true, diabetes: true, hipertensi: true, asma: true, tbc: true, merokok: true, konsumsi_alkohol: true, infeksi_virus: true, kecelakaan_trauma: true },
      where: { anak: anakFilter },
    });
    // Hitung jumlah anak dengan >1 risk factor
    let riskCount = 0;
    for (const r of riskData) {
      const risk = [r.diabetes, r.hipertensi, r.asma, r.tbc, r.merokok, r.konsumsi_alkohol, r.infeksi_virus, r.kecelakaan_trauma].filter(Boolean).length;
      if (risk > 0) riskCount++;
    }
    // Imunisasi Gap Analysis
    const imunisasiData = await prisma.riwayatImunisasi.findMany({ select: { anak_id: true, bgc: true, polio_1: true, polio_2: true, polio_3: true, polio_4: true, dpt_1: true, dpt_2: true, dpt_3: true, campak_1: true }, where: { anak: anakFilter } });
    let imunisasiKurang = 0;
    for (const i of imunisasiData) {
      if (!(i.bgc && i.polio_1 && i.polio_2 && i.polio_3 && i.polio_4 && i.dpt_1 && i.dpt_2 && i.dpt_3 && i.campak_1)) imunisasiKurang++;
    }

    // --- INSIGHT DEMOGRAFI & SOSIAL ---
    // Age Distribution - TAMPILKAN SEMUA DATA (tanpa filter waktu)
    const anakAges = await prisma.anak.findMany({ 
      select: { birth_date: true }, 
      where: { deleted_at: null } // Hanya filter deleted_at, tidak ada filter waktu
    });
    const nowYear = new Date().getFullYear();
    const ageDist: Record<string, number> = { '<2': 0, '2-4': 0, '4-6': 0, '>6': 0 };
    anakAges.forEach(a => {
      if (!a.birth_date) return;
      const age = nowYear - a.birth_date.getFullYear();
      if (age < 2) ageDist['<2']++;
      else if (age < 4) ageDist['2-4']++;
      else if (age < 6) ageDist['4-6']++;
      else ageDist['>6']++;
    });
    // Family Structure Impact
    const keluargaData = await prisma.hubunganKeluarga.findMany({ select: { tinggal_dengan: true }, where: { anak: anakFilter } });
    let inti = 0, extended = 0;
    keluargaData.forEach(k => {
      if ((k.tinggal_dengan || []).includes('Keluarga inti')) inti++;
      else extended++;
    });
    // Ambil semua anak_id yang lolos filter waktu
    const anakIds = (await prisma.anak.findMany({ select: { id: true }, where: anakFilter })).map(a => a.id);
    // Parental Education vs Child Development
    const ayahEdu = await prisma.orangTua.findMany({ where: { anak_id_ayah: { in: anakIds, not: null } }, select: { pendidikan_terakhir: true } });
    const ibuEdu = await prisma.orangTua.findMany({ where: { anak_id_ibu: { in: anakIds, not: null } }, select: { pendidikan_terakhir: true } });
    // (Korelasi sederhana: distribusi pendidikan)
    const eduDist: Record<string, number> = {};
    ayahEdu.concat(ibuEdu).forEach(e => {
      if (!e.pendidikan_terakhir) return;
      const key = e.pendidikan_terakhir.trim();
      eduDist[key] = (eduDist[key] || 0) + 1;
    });
    // Geographic Clustering
    const alamatData = await prisma.anak.findMany({ select: { birth_place: true }, where: anakFilter });
    const geoDist: Record<string, number> = {};
    alamatData.forEach(a => {
      if (!a.birth_place) return;
      const key = a.birth_place.trim();
      geoDist[key] = (geoDist[key] || 0) + 1;
    });

    // --- INSIGHT OPERASIONAL ---
    // Referral Source Analysis - TAMPILKAN SEMUA DATA (tanpa filter waktu)
    const referralData = await prisma.surveyAwal.findMany({ 
      select: { mengetahui_yamet_dari: true }, 
      where: { anak: { deleted_at: null } } // Hanya filter deleted_at, tidak ada filter waktu
    });
    const referralDist: Record<string, number> = {};
    referralData.forEach(r => {
      if (!r.mengetahui_yamet_dari) return;
      const key = r.mengetahui_yamet_dari.trim();
      referralDist[key] = (referralDist[key] || 0) + 1;
    });

    // --- NORMALISASI DATA SUMBER INFORMASI ---
    // Convert ke format yang dibutuhkan normalizer
    const sumberArray = Object.entries(referralDist).map(([sumber, count]) => ({
      sumber,
      count
    }));
    
    // Normalisasi sumber informasi
    const normalizedSumber = normalizeSumber(sumberArray);
    const formattedSumber = formatNormalizedData(normalizedSumber, 5);
    // Assessment to Treatment Conversion
    const totalAssessment = await prisma.penilaianAnak.count({ where: penilaianFilter });
    const totalProgram = await prisma.programTerapi.count({ where: programFilter });
    const assessmentConversionRate = totalAssessment > 0 ? (totalProgram / totalAssessment) * 100 : 0;
    // Previous Therapy History
    const terapiSebelumnya = await prisma.terapiSebelumnya.count({ where: { anak: anakFilter } });
    // Consultation Preference
    const konsultasiOnline = await prisma.surveyAwal.count({ where: { anak: anakFilter, bersedia_online: true } });
    const konsultasiOffline = await prisma.surveyAwal.count({ where: { anak: anakFilter, bersedia_online: false } });

    // --- INSIGHT PREDIKTIF ---
    // Early Warning System (dummy: anak dengan >2 risk factor)
    let earlyWarning = 0;
    for (const r of riskData) {
      const risk = [r.diabetes, r.hipertensi, r.asma, r.tbc, r.merokok, r.konsumsi_alkohol, r.infeksi_virus, r.kecelakaan_trauma].filter(Boolean).length;
      if (risk > 2) earlyWarning++;
    }
    // Therapy Success Prediction - TAMPILKAN SEMUA DATA (tanpa filter waktu)
    const therapySuccess = await prisma.anak.count({ 
      where: { deleted_at: null, status: 'LULUS' } // Hanya filter deleted_at, tidak ada filter waktu
    });
    // Seasonal Pattern (kunjungan per bulan)
    const sesiPerBulan = await prisma.sesiTerapi.groupBy({
      by: ['tanggal_sesi'],
      _count: { _all: true },
      where: sesiFilter,
    });
    // Family Compliance Predictor (dummy: keluarga inti vs extended)
    const compliance = { inti, extended };

    // --- INSIGHT BISNIS ---
    // Therapy Duration Analysis - TAMPILKAN SEMUA DATA (tanpa filter waktu)
    const terapiDurasi = await prisma.anak.findMany({ 
      select: { mulai_terapi: true, selesai_terapi: true }, 
      where: { deleted_at: null } // Hanya filter deleted_at, tidak ada filter waktu
    });
    let totalDurasi = 0, countDurasi = 0;
    terapiDurasi.forEach(t => {
      if (t.mulai_terapi && t.selesai_terapi) {
        const durasi = (t.selesai_terapi.getTime() - t.mulai_terapi.getTime()) / (1000 * 60 * 60 * 24 * 30); // bulan
        totalDurasi += durasi;
        countDurasi++;
      }
    });
    const avgDurasi = countDurasi > 0 ? totalDurasi / countDurasi : 0;

    // Gabungkan ke response dengan data yang disederhanakan
    let statistics: any = {};
    const userRole = user.peran;
    
    // Data dasar untuk semua role
    const baseStats = {
      total_anak: totalAnak,
      anak_keluar_bulan_lalu: anakKeluarBulanLalu,
      anak_keluar_bulan_ini: anakKeluarBulanIni,
      anak_aktif: anakAktif,
      conversion_data: {
        total_records: totalConversion,
        total_leads: totalLeads,
        total_anak_keluar: totalAnakKeluar,
        total_conversi: totalConversi,
        conversion_rate: conversionRate,
        data: conversionData
      },
      growth: growthData,
      period: period,
      filter_applied: filterStart ? filterStart.toISOString() : 'all_time'
    };
    
    if (userRole === 'SUPERADMIN') {
      statistics = {
        ...baseStats,
        total_admin: totalAdmins,
        total_terapis: totalTerapis,
        total_manajer: totalManajer,
        total_orangtua: totalOrangTua,
        admin_input_stats: adminInputStats, // Statistik inputan admin
        insight: {
          top_keluhan: topKeluhan.slice(0, 3), // Hanya top 3
          age_distribution: ageDist,
          referral_source: referralDist,
          therapy_success_count: therapySuccess,
          avg_therapy_duration_month: avgDurasi
        },
        normalized_data: {
          keluhan: {
            raw_data: keluhanArray,
            normalized_data: normalizedKeluhan,
            formatted: formattedKeluhan,
            summary: {
              total_unique_keluhan: keluhanArray.length,
              total_normalized_keluhan: normalizedKeluhan.length,
              top_keluhan: normalizedKeluhan.length > 0 ? normalizedKeluhan[0] : null
            }
          },
          sumber_informasi: {
            raw_data: sumberArray,
            normalized_data: normalizedSumber,
            formatted: formattedSumber,
            summary: {
              total_unique_sumber: sumberArray.length,
              total_normalized_sumber: normalizedSumber.length,
              top_sumber: normalizedSumber.length > 0 ? normalizedSumber[0] : null
            }
          }
        }
      };
    } else if (userRole === 'MANAJER') {
      statistics = {
        ...baseStats,
        total_admin: totalAdmins,
        total_terapis: totalTerapis,
        total_orangtua: totalOrangTua,
        admin_input_stats: adminInputStats, // Statistik inputan admin
        insight: {
          top_keluhan: topKeluhan.slice(0, 3),
          age_distribution: ageDist,
          referral_source: referralDist,
          therapy_success_count: therapySuccess
        },
        normalized_data: {
          keluhan: {
            raw_data: keluhanArray,
            normalized_data: normalizedKeluhan,
            formatted: formattedKeluhan,
            summary: {
              total_unique_keluhan: keluhanArray.length,
              total_normalized_keluhan: normalizedKeluhan.length,
              top_keluhan: normalizedKeluhan.length > 0 ? normalizedKeluhan[0] : null
            }
          },
          sumber_informasi: {
            raw_data: sumberArray,
            normalized_data: normalizedSumber,
            formatted: formattedSumber,
            summary: {
              total_unique_sumber: sumberArray.length,
              total_normalized_sumber: normalizedSumber.length,
              top_sumber: normalizedSumber.length > 0 ? normalizedSumber[0] : null
            }
          }
        }
      };
    } else if (userRole === 'ADMIN') {
      statistics = {
        ...baseStats,
        total_terapis: totalTerapis,
        total_orangtua: totalOrangTua,
        insight: {
          top_keluhan: topKeluhan.slice(0, 3),
          age_distribution: ageDist,
          referral_source: referralDist,
          therapy_success_count: therapySuccess
        },
        normalized_data: {
          keluhan: {
            raw_data: keluhanArray,
            normalized_data: normalizedKeluhan,
            formatted: formattedKeluhan,
            summary: {
              total_unique_keluhan: keluhanArray.length,
              total_normalized_keluhan: normalizedKeluhan.length,
              top_keluhan: normalizedKeluhan.length > 0 ? normalizedKeluhan[0] : null
            }
          },
          sumber_informasi: {
            raw_data: sumberArray,
            normalized_data: normalizedSumber,
            formatted: formattedSumber,
            summary: {
              total_unique_sumber: sumberArray.length,
              total_normalized_sumber: normalizedSumber.length,
              top_sumber: normalizedSumber.length > 0 ? normalizedSumber[0] : null
            }
          }
        }
      };
    } else {
      statistics = {
        ...baseStats,
        total_orangtua: totalOrangTua,
        insight: {
          top_keluhan: topKeluhan.slice(0, 3),
          age_distribution: ageDist
        },
        normalized_data: {
          keluhan: {
            raw_data: keluhanArray,
            normalized_data: normalizedKeluhan,
            formatted: formattedKeluhan,
            summary: {
              total_unique_keluhan: keluhanArray.length,
              total_normalized_keluhan: normalizedKeluhan.length,
              top_keluhan: normalizedKeluhan.length > 0 ? normalizedKeluhan[0] : null
            }
          },
          sumber_informasi: {
            raw_data: sumberArray,
            normalized_data: normalizedSumber,
            formatted: formattedSumber,
            summary: {
              total_unique_sumber: sumberArray.length,
              total_normalized_sumber: normalizedSumber.length,
              top_sumber: normalizedSumber.length > 0 ? normalizedSumber[0] : null
            }
          }
        }
      };
    }

    return createCorsResponse({
      status: 'success',
      message: 'Dashboard statistics fetched successfully',
      data: statistics,
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse(
        { status: 'error', message: 'Akses ditolak. Token tidak valid.' },
        401,
        request
      );
    }
    console.error('Dashboard stats error:', error);
    return createCorsResponse(
      { status: 'error', message: 'Terjadi kesalahan server' },
      500,
      request
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 