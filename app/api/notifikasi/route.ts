import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/auth';

// GET - Mengambil semua data notifikasi
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa melihat semua notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat melihat semua notifikasi.' }, { status: 403 });
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

    return NextResponse.json({
      success: true,
      data: notifikasis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifikasis:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Membuat data notifikasi baru
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa membuat notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat membuat notifikasi.' }, { status: 403 });
    }

    const body = await request.json();
    const { jenis_pemberitahuan, isi_notifikasi, tujuan } = body;

    // Validasi input
    if (!jenis_pemberitahuan || !isi_notifikasi || !tujuan) {
      return NextResponse.json({ 
        error: 'Semua field harus diisi: jenis_pemberitahuan, isi_notifikasi, tujuan' 
      }, { status: 400 });
    }

    // Validasi jenis_pemberitahuan
    const validJenis = ['INFO', 'WARNING', 'SUCCESS', 'ERROR'];
    if (!validJenis.includes(jenis_pemberitahuan)) {
      return NextResponse.json({ 
        error: 'Jenis pemberitahuan harus salah satu dari: INFO, WARNING, SUCCESS, ERROR' 
      }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      message: 'Data notifikasi berhasil dibuat',
      data: notifikasi
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notifikasi:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
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
      return NextResponse.json({ error: 'ID notifikasi diperlukan' }, { status: 400 });
    }

    // Cek apakah notifikasi ada
    const existingNotifikasi = await prisma.notifikasi.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingNotifikasi) {
      return NextResponse.json({ error: 'Data notifikasi tidak ditemukan' }, { status: 404 });
    }

    // Validasi jenis_pemberitahuan jika diupdate
    if (jenis_pemberitahuan) {
      const validJenis = ['INFO', 'WARNING', 'SUCCESS', 'ERROR'];
      if (!validJenis.includes(jenis_pemberitahuan)) {
        return NextResponse.json({ 
          error: 'Jenis pemberitahuan harus salah satu dari: INFO, WARNING, SUCCESS, ERROR' 
        }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      message: 'Data notifikasi berhasil diupdate',
      data: updatedNotifikasi
    });
  } catch (error) {
    console.error('Error updating notifikasi:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE - Menghapus data notifikasi
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa delete notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat menghapus notifikasi.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID notifikasi diperlukan' }, { status: 400 });
    }

    // Cek apakah notifikasi ada
    const existingNotifikasi = await prisma.notifikasi.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingNotifikasi) {
      return NextResponse.json({ error: 'Data notifikasi tidak ditemukan' }, { status: 404 });
    }

    await prisma.notifikasi.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Data notifikasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting notifikasi:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 