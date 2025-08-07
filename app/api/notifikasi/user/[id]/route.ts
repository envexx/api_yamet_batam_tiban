import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

// OPTIONS - Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

// GET - Mengambil data notifikasi berdasarkan ID untuk user tertentu
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

    // Cek apakah notifikasi ditujukan untuk user yang sedang login
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return createCorsResponse({ error: 'User tidak ditemukan' }, 404, request);
    }

    // Validasi apakah notifikasi ditujukan untuk user ini
    if (!user.email || !existingNotifikasi.tujuan.includes(user.email)) {
      return createCorsResponse({ error: 'Akses ditolak. Notifikasi tidak ditujukan untuk user ini.' }, 403, request);
    }

    return createCorsResponse({
      success: true,
      data: existingNotifikasi
    }, 200, request);
  } catch (error) {
    console.error('Error fetching notifikasi:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

// PUT - Mark notifikasi sebagai read berdasarkan ID
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

    const body = await request.json();
    const { is_read } = body;
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