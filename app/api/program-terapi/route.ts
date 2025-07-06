import { NextRequest } from 'next/server';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../lib/cors';

const ALLOWED_SORT_FIELDS = ['id', 'full_name']; // tambahkan field lain jika perlu

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses hanya untuk admin/superadmin.' }, 403, request);
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const anakId = searchParams.get('anakId');
    let sortBy = searchParams.get('sortBy') || 'id';
    if (!ALLOWED_SORT_FIELDS.includes(sortBy)) sortBy = 'id';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const skip = (page - 1) * limit;
    // Build where clause for anak
    const anakWhere: any = { deleted_at: null };
    if (anakId) {
      anakWhere.id = parseInt(anakId);
    } else if (search) {
      anakWhere.full_name = { contains: search, mode: 'insensitive' };
    }
    const total = await prisma.anak.count({ where: anakWhere });
    const anakList = await prisma.anak.findMany({
      where: anakWhere,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder.toLowerCase() },
      select: {
        id: true,
        full_name: true,
        program_terapi: {
          orderBy: { created_at: 'desc' },
          include: {
            user_created: { 
              select: { id: true, name: true } 
            },
          },
        },
      },
    });
    const totalPages = Math.ceil(total / limit);
    return createCorsResponse({
      status: 'success',
      message: 'Program terapi grouped by anak fetched',
      data: anakList,
      pagination: { page, limit, total, totalPages },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 