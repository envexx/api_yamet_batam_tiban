import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// OPTIONS - Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

// GET - Mengambil notifikasi untuk user yang sedang login
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

    // Ambil data user untuk mendapatkan role
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    });

    if (!user) {
      return createCorsResponse({ error: 'User tidak ditemukan' }, 404, request);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const jenis_pemberitahuan = searchParams.get('jenis_pemberitahuan') || '';
    const is_read = searchParams.get('is_read');

    const skip = (page - 1) * limit;

    // Build where clause untuk notifikasi yang relevan
    const where: any = {
      OR: [
        { tujuan: 'ALL' }, // Notifikasi untuk semua user
        { tujuan: { startsWith: `ROLE:${user.role.name}` } }, // Notifikasi untuk role tertentu
        { tujuan: { contains: `USER:${user.id}` } }, // Notifikasi untuk user tertentu
      ]
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

// PUT - Mark notifikasi sebagai read
export async function PUT(request: NextRequest) {
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
    const { id } = body;

    if (!id) {
      return createCorsResponse({ error: 'ID notifikasi diperlukan' }, 400, request);
    }

    // Cek apakah notifikasi ada
    const existingNotifikasi = await prisma.notifikasi.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingNotifikasi) {
      return createCorsResponse({ error: 'Data notifikasi tidak ditemukan' }, 404, request);
    }

    // Update notifikasi menjadi read
    const updatedNotifikasi = await prisma.notifikasi.update({
      where: { id: parseInt(id) },
      data: {
        is_read: true,
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
      message: 'Notifikasi berhasil ditandai sebagai dibaca',
      data: updatedNotifikasi
    }, 200, request);
  } catch (error) {
    console.error('Error marking notifikasi as read:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
} 