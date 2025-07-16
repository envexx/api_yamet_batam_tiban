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

    // 1. Ringkasan Data Pasien
    const totalPasien = await prisma.anak.count({
      where: { deleted_at: null }
    });

    const pasienAktif = await prisma.anak.count({
      where: { 
        deleted_at: null,
        status: 'AKTIF'
      }
    });

    const pasienCuti = await prisma.anak.count({
      where: { 
        deleted_at: null,
        status: 'CUTI'
      }
    });

    const pasienBerhenti = await prisma.anak.count({
      where: { 
        deleted_at: null,
        status: 'BERHENTI'
      }
    });

    // 2. Keluhan Terbanyak
    const keluhanData = await prisma.surveyAwal.findMany({
      where: {
        anak: { deleted_at: null }
      },
      select: {
        keluhan_orang_tua: true
      }
    });

    // Hitung frekuensi keluhan
    const keluhanCount: Record<string, number> = {};
    keluhanData.forEach(survey => {
      survey.keluhan_orang_tua.forEach(keluhan => {
        keluhanCount[keluhan] = (keluhanCount[keluhan] || 0) + 1;
      });
    });

    const keluhanTerbanyak = Object.entries(keluhanCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([keluhan, count]) => ({ keluhan, count }));

    // 3. Data Orang Tua
    const dataOrangTua = await prisma.orangTua.findMany({
      where: {
        OR: [
          { anak_as_ayah: { deleted_at: null } },
          { anak_as_ibu: { deleted_at: null } }
        ]
      },
      select: {
        pendidikan_terakhir: true,
        pekerjaan_saat_ini: true,
        alamat_rumah: true
      }
    });

    // Analisis pendidikan orang tua
    const pendidikanCount: Record<string, number> = {};
    dataOrangTua.forEach(ortu => {
      if (ortu.pendidikan_terakhir) {
        pendidikanCount[ortu.pendidikan_terakhir] = (pendidikanCount[ortu.pendidikan_terakhir] || 0) + 1;
      }
    });

    // Analisis pekerjaan orang tua
    const pekerjaanCount: Record<string, number> = {};
    dataOrangTua.forEach(ortu => {
      if (ortu.pekerjaan_saat_ini) {
        pekerjaanCount[ortu.pekerjaan_saat_ini] = (pekerjaanCount[ortu.pekerjaan_saat_ini] || 0) + 1;
      }
    });

    // 4. Pertumbuhan Pasien (per bulan)
    const pertumbuhanPasien = await prisma.anak.groupBy({
      by: ['created_at'],
      where: { deleted_at: null },
      _count: { id: true }
    });

    // Kelompokkan per bulan
    const pertumbuhanPerBulan: Record<string, number> = {};
    pertumbuhanPasien.forEach(item => {
      const month = item.created_at.toISOString().substring(0, 7); // YYYY-MM
      pertumbuhanPerBulan[month] = (pertumbuhanPerBulan[month] || 0) + item._count.id;
    });

    const pertumbuhanData = Object.entries(pertumbuhanPerBulan)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([bulan, jumlah]) => ({ bulan, jumlah }));

    // 5. Analisis Usia Pasien
    const usiaPasien = await prisma.anak.findMany({
      where: { deleted_at: null },
      select: {
        birth_date: true
      }
    });

    const usiaCount: Record<string, number> = {
      '0-2 tahun': 0,
      '3-5 tahun': 0,
      '6-8 tahun': 0,
      '9-12 tahun': 0,
      '13+ tahun': 0
    };

    const now = new Date();
    usiaPasien.forEach(pasien => {
      if (pasien.birth_date) {
        const usia = now.getFullYear() - pasien.birth_date.getFullYear();
        if (usia <= 2) usiaCount['0-2 tahun']++;
        else if (usia <= 5) usiaCount['3-5 tahun']++;
        else if (usia <= 8) usiaCount['6-8 tahun']++;
        else if (usia <= 12) usiaCount['9-12 tahun']++;
        else usiaCount['13+ tahun']++;
      }
    });

    return createCorsResponse({
      status: 'success',
      message: 'Data dashboard marketing berhasil diambil',
      data: {
        ringkasan_pasien: {
          total: totalPasien,
          aktif: pasienAktif,
          cuti: pasienCuti,
          berhenti: pasienBerhenti
        },
        keluhan_terbanyak: keluhanTerbanyak,
        data_orang_tua: {
          pendidikan: Object.entries(pendidikanCount).map(([pendidikan, count]) => ({ pendidikan, count })),
          pekerjaan: Object.entries(pekerjaanCount).map(([pekerjaan, count]) => ({ pekerjaan, count }))
        },
        pertumbuhan_pasien: pertumbuhanData,
        distribusi_usia: Object.entries(usiaCount).map(([rentang, jumlah]) => ({ rentang, jumlah }))
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    console.error('Marketing dashboard error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 