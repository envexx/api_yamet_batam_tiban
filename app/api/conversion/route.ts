import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/auth';

// GET - Mengambil semua data conversion
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

    // Role-based access control
    if (!['SUPERADMIN', 'ADMIN', 'MANAJER'].includes(decoded.peran)) {
      return NextResponse.json({ error: 'Akses ditolak. Role tidak diizinkan.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const bulan = searchParams.get('bulan') || '';
    const tahun = searchParams.get('tahun') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { bulan: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (bulan) {
      where.bulan = bulan;
    }
    if (tahun) {
      where.tahun = parseInt(tahun);
    }

    const [conversions, total] = await Promise.all([
      prisma.conversion.findMany({
        where,
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
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.conversion.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: conversions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversions:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Membuat data conversion baru
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

    // Role-based access control - Hanya SUPERADMIN dan ADMIN yang bisa membuat
    if (!['SUPERADMIN', 'ADMIN'].includes(decoded.peran)) {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN dan ADMIN yang dapat membuat data conversion.' }, { status: 403 });
    }

    const body = await request.json();
    const { jumlah_anak_keluar, jumlah_leads, jumlah_conversi, bulan, tahun } = body;

    // Validasi input
    if (jumlah_anak_keluar === undefined || jumlah_anak_keluar === null || 
        jumlah_leads === undefined || jumlah_leads === null || 
        jumlah_conversi === undefined || jumlah_conversi === null || 
        !bulan || !tahun) {
      return NextResponse.json({ 
        error: 'Semua field harus diisi: jumlah_anak_keluar, jumlah_leads, jumlah_conversi, bulan, tahun' 
      }, { status: 400 });
    }

    // Cek apakah data untuk bulan dan tahun yang sama sudah ada
    const existingConversion = await prisma.conversion.findFirst({
      where: {
        bulan,
        tahun: parseInt(tahun)
      }
    });

    if (existingConversion) {
      return NextResponse.json({ 
        error: 'Data conversion untuk bulan dan tahun ini sudah ada' 
      }, { status: 400 });
    }

    const conversion = await prisma.conversion.create({
      data: {
        jumlah_anak_keluar: parseInt(jumlah_anak_keluar),
        jumlah_leads: parseInt(jumlah_leads),
        jumlah_conversi: parseInt(jumlah_conversi),
        bulan,
        tahun: parseInt(tahun),
                 created_by: decoded.id,
         updated_by: decoded.id,
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
      message: 'Data conversion berhasil dibuat',
      data: conversion
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversion:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// PUT - Mengupdate data conversion
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

    // Role-based access control - Hanya SUPERADMIN dan ADMIN yang bisa update
    if (!['SUPERADMIN', 'ADMIN'].includes(decoded.peran)) {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN dan ADMIN yang dapat mengupdate data conversion.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, jumlah_anak_keluar, jumlah_leads, jumlah_conversi, bulan, tahun } = body;

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

// DELETE - Menghapus data conversion
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

    // Role-based access control - Hanya SUPERADMIN yang bisa delete
    if (decoded.peran !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya SUPERADMIN yang dapat menghapus data conversion.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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