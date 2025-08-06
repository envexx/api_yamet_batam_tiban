import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

// PUT - Mark notifikasi sebagai read berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { is_read } = body;
    const { id } = await params;

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
        is_read: is_read !== undefined ? Boolean(is_read) : true,
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