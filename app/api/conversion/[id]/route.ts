import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// PUT - Mengupdate data conversion berdasarkan ID
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

    // Role-based access control - Hanya SUPERADMIN dan ADMIN yang bisa update
    if (!['SUPERADMIN', 'ADMIN'].includes(decoded.peran)) {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN dan ADMIN yang dapat mengupdate data conversion.' }, 403, request);
    }

    const body = await request.json();
    const { jumlah_anak_keluar, jumlah_leads, jumlah_conversi, bulan, tahun } = body;
    const { id } = await params;

    if (!id) {
      return createCorsResponse({ error: 'ID conversion diperlukan' }, 400, request);
    }

    // Cek apakah conversion ada
    const existingConversion = await prisma.conversion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingConversion) {
      return createCorsResponse({ error: 'Data conversion tidak ditemukan' }, 404, request);
    }

    // Cek apakah bulan dan tahun yang baru sudah ada (kecuali untuk record yang sama)
    if (bulan && tahun) {
      const duplicateConversion = await prisma.conversion.findFirst({
        where: {
          bulan,
          tahun: parseInt(tahun),
          id: { not: parseInt(id) }
        }
      });

      if (duplicateConversion) {
        return createCorsResponse({ 
          error: 'Data conversion untuk bulan dan tahun ini sudah ada' 
        }, 400, request);
      }
    }

    const updatedConversion = await prisma.conversion.update({
      where: { id: parseInt(id) },
      data: {
        jumlah_anak_keluar: jumlah_anak_keluar !== undefined && jumlah_anak_keluar !== null ? parseInt(jumlah_anak_keluar) : undefined,
        jumlah_leads: jumlah_leads !== undefined && jumlah_leads !== null ? parseInt(jumlah_leads) : undefined,
        jumlah_conversi: jumlah_conversi !== undefined && jumlah_conversi !== null ? parseInt(jumlah_conversi) : undefined,
        bulan: bulan || undefined,
        tahun: tahun !== undefined && tahun !== null ? parseInt(tahun) : undefined,
        updated_by: decoded.id,
        updated_at: new Date(),
      },
      include: {
        user_created: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        user_updated: {
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
      message: 'Data conversion berhasil diupdate',
      data: updatedConversion
    }, 200, request);
  } catch (error) {
    console.error('Error updating conversion:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

// DELETE - Menghapus data conversion berdasarkan ID
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

    // Role-based access control - Hanya SUPERADMIN yang bisa delete
    if (decoded.peran !== 'SUPERADMIN') {
      return createCorsResponse({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat menghapus data conversion.' }, 403, request);
    }

    const { id } = await params;

    if (!id) {
      return createCorsResponse({ error: 'ID conversion diperlukan' }, 400, request);
    }

    // Cek apakah conversion ada
    const existingConversion = await prisma.conversion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingConversion) {
      return createCorsResponse({ error: 'Data conversion tidak ditemukan' }, 404, request);
    }

    await prisma.conversion.delete({
      where: { id: parseInt(id) }
    });

    return createCorsResponse({
      success: true,
      message: 'Data conversion berhasil dihapus'
    }, 200, request);
  } catch (error) {
    console.error('Error deleting conversion:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

// GET - Mengambil data conversion berdasarkan ID
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

    // Role-based access control
    if (!['SUPERADMIN', 'ADMIN', 'MANAJER'].includes(decoded.peran)) {
      return createCorsResponse({ error: 'Akses ditolak. Role tidak diizinkan.' }, 403, request);
    }

    const { id } = await params;

    if (!id) {
      return createCorsResponse({ error: 'ID conversion diperlukan' }, 400, request);
    }

    const conversion = await prisma.conversion.findUnique({
      where: { id: parseInt(id) },
      include: {
        user_created: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        user_updated: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!conversion) {
      return createCorsResponse({ error: 'Data conversion tidak ditemukan' }, 404, request);
    }

    return createCorsResponse({
      success: true,
      data: conversion
    }, 200, request);
  } catch (error) {
    console.error('Error fetching conversion:', error);
    return createCorsResponse({ error: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 