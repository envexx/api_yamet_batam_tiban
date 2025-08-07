import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

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