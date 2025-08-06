import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

// POST - Menghapus data notifikasi berdasarkan ID (fallback untuk frontend yang menggunakan POST)
export async function POST(
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

    // Role-based access control - Hanya SUPERADMIN yang bisa delete notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat menghapus notifikasi.' }, { status: 403 });
    }

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