import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../lib/cors';

// GET - Mengambil semua data notifikasi
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

    // Role-based access control - Hanya SUPERADMIN yang bisa melihat semua notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat melihat semua notifikasi.' }, 403, request);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const jenis_pemberitahuan = searchParams.get('jenis_pemberitahuan') || '';
    const is_read = searchParams.get('is_read');
    const tujuan = searchParams.get('tujuan') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
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
    if (tujuan) {
      where.tujuan = { contains: tujuan, mode: 'insensitive' };
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
    console.error('Error fetching notifikasis:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

// POST - Membuat data notifikasi baru
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

    // Role-based access control - Hanya SUPERADMIN yang bisa membuat notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat membuat notifikasi.' }, 403, request);
    }

    const body = await request.json();
    const { jenis_pemberitahuan, isi_notifikasi, tujuan } = body;

    // Validasi input
    if (!jenis_pemberitahuan || !isi_notifikasi || !tujuan) {
      return createCorsResponse({ 
        error: 'Semua field harus diisi: jenis_pemberitahuan, isi_notifikasi, tujuan' 
      }, 400, request);
    }

    // Validasi jenis_pemberitahuan
    const validJenis = ['INFO', 'WARNING', 'SUCCESS', 'ERROR'];
    if (!validJenis.includes(jenis_pemberitahuan)) {
      return createCorsResponse({ 
        error: 'Jenis pemberitahuan harus salah satu dari: INFO, WARNING, SUCCESS, ERROR' 
      }, 400, request);
    }

    const notifikasi = await prisma.notifikasi.create({
      data: {
        jenis_pemberitahuan,
        isi_notifikasi,
        tujuan,
                 created_by: decoded.id,
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
      message: 'Data notifikasi berhasil dibuat',
      data: notifikasi
    }, 201, request);
  } catch (error) {
    console.error('Error creating notifikasi:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

// PUT - Mengupdate data notifikasi
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa update notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat mengupdate notifikasi.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, jenis_pemberitahuan, isi_notifikasi, tujuan, is_read } = body;

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

    // Validasi jenis_pemberitahuan jika diupdate
    if (jenis_pemberitahuan) {
      const validJenis = ['INFO', 'WARNING', 'SUCCESS', 'ERROR'];
      if (!validJenis.includes(jenis_pemberitahuan)) {
        return createCorsResponse({ 
          error: 'Jenis pemberitahuan harus salah satu dari: INFO, WARNING, SUCCESS, ERROR' 
        }, 400, request);
      }
    }

    const updatedNotifikasi = await prisma.notifikasi.update({
      where: { id: parseInt(id) },
      data: {
        jenis_pemberitahuan: jenis_pemberitahuan || undefined,
        isi_notifikasi: isi_notifikasi || undefined,
        tujuan: tujuan || undefined,
        is_read: is_read !== undefined ? Boolean(is_read) : undefined,
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

// DELETE - Menghapus data notifikasi
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return createCorsResponse({ error: 'Token tidak ditemukan' }, 401, request);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return createCorsResponse({ error: 'Token tidak valid' }, 401, request);
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa delete notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat menghapus notifikasi.' }, 403, request);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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

    await prisma.notifikasi.delete({
      where: { id: parseInt(id) }
    });

    return createCorsResponse({
      success: true,
      message: 'Data notifikasi berhasil dihapus'
    }, 200, request);
  } catch (error) {
    console.error('Error deleting notifikasi:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 