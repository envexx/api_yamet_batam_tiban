import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

export async function GET(request: NextRequest) {
  try {
    const userPayload = requireAuth(request);
    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
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
    if (!user) {
      return createCorsResponse({ status: 'error', message: 'User tidak ditemukan' }, 404);
    }
    return createCorsResponse({ 
      status: 'success', 
      data: { 
        user: {
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
        }
      } 
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

export async function OPTIONS() {
  return createCorsOptionsResponse();
} 