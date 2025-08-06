import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

// GET - Mengambil notifikasi untuk user yang sedang login
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const is_read = searchParams.get('is_read');

    const skip = (page - 1) * limit;

    // Ambil data user untuk mendapatkan role
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Build where clause untuk notifikasi yang relevan
    const where: any = {
      OR: [
        { tujuan: 'ALL' }, // Notifikasi untuk semua user
        { tujuan: { startsWith: `ROLE:${user.role.name}` } }, // Notifikasi untuk role tertentu
        { tujuan: { contains: `USER:${user.id}` } }, // Notifikasi untuk user tertentu
      ]
    };

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
    console.error('Error fetching user notifikasis:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// PUT - Mark notifikasi sebagai read
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

    const body = await request.json();
    const { id } = body;

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

    return NextResponse.json({
      success: true,
      message: 'Notifikasi berhasil ditandai sebagai dibaca',
      data: updatedNotifikasi
    });
  } catch (error) {
    console.error('Error marking notifikasi as read:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 