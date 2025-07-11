import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createCorsResponse } from '@/app/lib/cors';

export async function GET(request: NextRequest) {
  try {
    // Ambil seluruh data yang dibutuhkan (contoh: semua tabel utama)
    const users = await prisma.user.findMany();
    const anak = await prisma.anak.findMany();
    const penilaianAnak = await prisma.penilaianAnak.findMany();
    const programTerapi = await prisma.programTerapi.findMany();
    // Tambahkan tabel lain sesuai kebutuhan

    return createCorsResponse({
      status: 'success',
      data: {
        users,
        anak,
        penilaianAnak,
        programTerapi,
        // ...tambahkan data lain jika perlu
      }
    }, 200, request);
  } catch (error) {
    console.error('Error get all data:', error);
    return createCorsResponse({ status: 'error', message: 'Gagal mengambil data' }, 500, request);
  }
} 