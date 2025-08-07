import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// OPTIONS - Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

// GET - Mengambil notifikasi untuk user tertentu
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return createCorsResponse({ error: 'Token tidak ditemukan' }, 401, request);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return createCorsResponse({ error: 'Token tidak valid' }, 401, request);
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return createCorsResponse({ error: 'User ID diperlukan' }, 400, request);
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return createCorsResponse({ error: 'User tidak ditemukan' }, 404, request);
    }

    const { searchParams: urlSearchParams } = new URL(request.url);
    const page = parseInt(urlSearchParams.get('page') || '1');
    const limit = parseInt(urlSearchParams.get('limit') || '10');
    const search = urlSearchParams.get('search') || '';
    const jenis_pemberitahuan = urlSearchParams.get('jenis_pemberitahuan') || '';
    const is_read = urlSearchParams.get('is_read');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      tujuan: { contains: user.email, mode: 'insensitive' }
    };

    if (search) {
      where.OR = [
        { isi_notifikasi: { contains: search, mode: 'insensitive' } },
        { jenis_pemberitahuan: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (jenis_pemberitahuan) {
      where.jenis_pemberitahuan = jenis_pemberitahuan;
    }
    if (is_read !== null && is_read !== undefined) {
      where.is_read = is_read === 'true';
    }

    const [notifikasis, total] = await Promise.all([
      prisma.notifikasi.findMany({
        where,
        include: {
          user_created: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.notifikasi.count({ where })
    ]);

    return createCorsResponse({
      success: true,
      data: notifikasis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 200, request);
  } catch (error) {
    console.error('Error fetching user notifikasis:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

// POST - Membuat notifikasi untuk user tertentu
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return createCorsResponse({ error: 'Token tidak ditemukan' }, 401, request);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return createCorsResponse({ error: 'Token tidak valid' }, 401, request);
    }

    const body = await request.json();
    const { user_id, jenis_pemberitahuan, isi_notifikasi, tujuan } = body;

    if (!user_id || !jenis_pemberitahuan || !isi_notifikasi || !tujuan) {
      return createCorsResponse({ error: 'ID notifikasi diperlukan' }, 400, request);
    }

    // Cek apakah notifikasi ada
    const existingNotifikasi = await prisma.notifikasi.findUnique({
      where: { id: parseInt(user_id) }
    });

    if (!existingNotifikasi) {
      return createCorsResponse({ error: 'Data notifikasi tidak ditemukan' }, 404, request);
    }

    // Validasi jenis_pemberitahuan
    const validJenis = ['INFO', 'WARNING', 'SUCCESS', 'ERROR'];
    if (!validJenis.includes(jenis_pemberitahuan)) {
      return createCorsResponse({ 
        error: 'Jenis pemberitahuan harus salah satu dari: INFO, WARNING, SUCCESS, ERROR' 
      }, 400, request);
    }

    const updatedNotifikasi = await prisma.notifikasi.update({
      where: { id: parseInt(user_id) },
      data: {
        jenis_pemberitahuan,
        isi_notifikasi,
        tujuan,
        updated_at: new Date(),
      },
      include: {
        user_created: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return createCorsResponse({
      success: true,
      message: 'Data notifikasi berhasil diupdate',
      data: updatedNotifikasi
    }, 200, request);
  } catch (error) {
    console.error('Error updating notifikasi:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
} 