import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import { z } from 'zod';

const toggleSchema = z.object({
  userId: z.number(),
  is_active: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const actor = requireAuth(request);
    const body = await request.json();
    const { userId, is_active } = toggleSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: { select: { name: true } } }
    });
    if (!user) {
      console.error('[TOGGLE] User not found:', userId);
      return createCorsResponse({ status: 'error', message: 'User tidak ditemukan' }, 404);
    }
    // Role check: SUPERADMIN boleh toggle admin/terapis, ADMIN boleh toggle terapis
    if (user.role?.name === 'ADMIN' && actor.peran !== 'SUPERADMIN') {
      console.error('[TOGGLE] Forbidden: Only superadmin can toggle admin. Actor:', actor);
      return createCorsResponse({ status: 'error', message: 'Hanya superadmin yang dapat mengubah status admin.' }, 403);
    }
    if (user.role?.name === 'TERAPIS' && !['SUPERADMIN', 'ADMIN'].includes(actor.peran)) {
      console.error('[TOGGLE] Forbidden: Only superadmin/admin can toggle terapis. Actor:', actor);
      return createCorsResponse({ status: 'error', message: 'Hanya superadmin atau admin yang dapat mengubah status terapis.' }, 403);
    }
    const currentStatus = user.status === 'active';
    if (currentStatus === !is_active) {
      return createCorsResponse({ status: 'error', message: `User sudah ${currentStatus ? 'aktif' : 'nonaktif'}.` }, 400);
    }
    await prisma.user.update({
      where: { id: userId },
      data: { status: is_active ? 'active' : 'inactive' },
    });
    return createCorsResponse({ status: 'success', message: `User berhasil di${is_active ? 'aktifkan' : 'nonaktifkan'}.` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[TOGGLE] Zod validation error:', error.errors);
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400);
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      console.error('[TOGGLE] Unauthorized:', error);
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    console.error('[TOGGLE] Server error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 