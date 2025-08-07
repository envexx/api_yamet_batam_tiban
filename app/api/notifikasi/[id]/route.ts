import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// OPTIONS - Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

// DELETE - Menghapus data notifikasi berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

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

// PUT - Mengupdate data notifikasi berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return createCorsResponse({ error: 'Token tidak ditemukan' }, 401, request);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return createCorsResponse({ error: 'Token tidak valid' }, 401, request);
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa update notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat mengupdate notifikasi.' }, 403, request);
    }

    const body = await request.json();
    const { jenis_pemberitahuan, isi_notifikasi, tujuan, is_read } = body;
    const { id } = await params;

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

// GET - Mengambil data notifikasi berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return createCorsResponse({ error: 'Token tidak ditemukan' }, 401, request);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return createCorsResponse({ error: 'Token tidak valid' }, 401, request);
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa melihat detail notifikasi
    if (decoded.peran !== 'SUPERADMIN') {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat melihat detail notifikasi.' }, 403, request);
    }

    const { id } = await params;

    if (!id) {
      return createCorsResponse({ error: 'ID notifikasi diperlukan' }, 400, request);
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
      return createCorsResponse({ error: 'Data notifikasi tidak ditemukan' }, 404, request);
    }

    return createCorsResponse({
      success: true,
      data: notifikasi
    }, 200, request);
  } catch (error) {
    console.error('Error fetching notifikasi:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
} 