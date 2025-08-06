import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

// PUT - Mengupdate data conversion berdasarkan ID
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

    // Role-based access control - Hanya SUPERADMIN dan ADMIN yang bisa update
    if (!['SUPERADMIN', 'ADMIN'].includes(decoded.peran)) {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN dan ADMIN yang dapat mengupdate data conversion.' }, { status: 403 });
    }

    const body = await request.json();
    const { jumlah_anak_keluar, jumlah_leads, jumlah_conversi, bulan, tahun } = body;
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID conversion diperlukan' }, { status: 400 });
    }

    // Cek apakah conversion ada
    const existingConversion = await prisma.conversion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingConversion) {
      return NextResponse.json({ error: 'Data conversion tidak ditemukan' }, { status: 404 });
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
        return NextResponse.json({ 
          error: 'Data conversion untuk bulan dan tahun ini sudah ada' 
        }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      message: 'Data conversion berhasil diupdate',
      data: updatedConversion
    });
  } catch (error) {
    console.error('Error updating conversion:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
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
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Role-based access control - Hanya SUPERADMIN yang bisa delete
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat menghapus data conversion.' }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID conversion diperlukan' }, { status: 400 });
    }

    // Cek apakah conversion ada
    const existingConversion = await prisma.conversion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingConversion) {
      return NextResponse.json({ error: 'Data conversion tidak ditemukan' }, { status: 404 });
    }

    await prisma.conversion.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Data conversion berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting conversion:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
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
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Role-based access control
    if (!['SUPERADMIN', 'ADMIN', 'MANAJER'].includes(decoded.peran)) {
      return NextResponse.json({ error: 'Akses ditolak. Role tidak diizinkan.' }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID conversion diperlukan' }, { status: 400 });
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
      return NextResponse.json({ error: 'Data conversion tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: conversion
    });
  } catch (error) {
    console.error('Error fetching conversion:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 