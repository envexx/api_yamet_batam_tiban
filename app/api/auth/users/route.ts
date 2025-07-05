import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (user.peran !== 'SUPERADMIN') {
      return createCorsResponse({ status: 'error', message: 'Akses hanya untuk superadmin.' }, 403);
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    let sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const skip = (page - 1) * limit;
    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { full_name: { contains: search, mode: 'insensitive' } },
      ];
    }
    // Get total count
    const total = await prisma.user.count({ where });
    const totalAdmin = await prisma.user.count({ where: { role: { name: 'ADMIN' } } });
    const totalTerapis = await prisma.user.count({ where: { role: { name: 'TERAPIS' } } });
    const totalOrangTua = await prisma.user.count({ where: { role: { name: 'ORANGTUA' } } });
    // Get user data
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder.toLowerCase() as 'asc' | 'desc',
      },
      include: {
        role: { select: { name: true } },
        creator: {
          select: {
            id: true,
            name: true,
            role: { select: { name: true } }
          }
        }
      },
    });
    const totalPages = Math.ceil(total / limit);
    return createCorsResponse({
      status: 'success',
      message: 'Data user berhasil diambil',
      data: {
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          peran: user.role?.name,
          status: user.status,
          created_at: user.created_at,
          updated_at: user.updated_at,
          created_by: user.created_by,
          role_id: user.role_id,
          creator: user.creator,
        })),
        statistics: {
          totalAdmin,
          totalTerapis,
          totalOrangTua,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse();
} 