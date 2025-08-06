import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

// DELETE - Menghapus data notifikasi berdasarkan ID
export async function DELETE(
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

// PUT - Mengupdate data notifikasi berdasarkan ID
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

    // Role-based access control - Hanya SUPERADMIN yang bisa update notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat mengupdate notifikasi.' }, { status: 403 });
    }

    const body = await request.json();
    const { jenis_pemberitahuan, isi_notifikasi, tujuan, is_read } = body;
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

// GET - Mengambil data notifikasi berdasarkan ID
export async function GET(
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

    // Role-based access control - Hanya SUPERADMIN yang bisa melihat detail notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat melihat detail notifikasi.' }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID notifikasi diperlukan' }, { status: 400 });
    }

    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id: parseInt(id) },
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

    if (!notifikasi) {
      return NextResponse.json({ error: 'Data notifikasi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: notifikasi
    });
  } catch (error) {
    console.error('Error fetching notifikasi:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 