import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createCorsResponse } from '@/app/lib/cors';

export async function GET(request: NextRequest) {
  try {
    // Ambil data anak beserta relasi orang tua (ayah, ibu)
    const anak = await prisma.anak.findMany({
      include: {
        ayah: true,
        ibu: true,
      },
    });
    const penilaianAnak = await prisma.penilaianAnak.findMany();
    const programTerapi = await prisma.programTerapi.findMany();
    // Tidak mengirim data users atau data sensitif lain

    return createCorsResponse({
      status: 'success',
      data: {
        anak,
        penilaianAnak,
        programTerapi,
      }
    }, 200, request);
  } catch (error) {
    console.error('Error get all data:', error);
    return createCorsResponse({ status: 'error', message: 'Gagal mengambil data' }, 500, request);
  }
} 