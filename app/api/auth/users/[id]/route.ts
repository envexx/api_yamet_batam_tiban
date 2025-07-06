import { NextRequest } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    
    // Check if user is SUPERADMIN or requesting their own data
    if (user.peran !== 'SUPERADMIN' && user.id !== parseInt(params.id)) {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Anda hanya dapat melihat data diri sendiri.' 
      }, 403, request);
    }

    const userData = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        role: { select: { name: true } },
        creator: {
          select: {
            id: true,
            name: true,
            role: { select: { name: true } }
          }
        }
      }
    });

    if (!userData) {
      return createCorsResponse({ 
        status: 'error', 
        message: 'User tidak ditemukan' 
      }, 404, request);
    }

    return createCorsResponse({
      status: 'success',
      message: 'Data user berhasil diambil',
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          peran: userData.role?.name,
          status: userData.status,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          created_by: userData.created_by,
          role_id: userData.role_id,
          creator: userData.creator,
        },
      },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Token tidak valid.' 
      }, 401, request);
    }
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 