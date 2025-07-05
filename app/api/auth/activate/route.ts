import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import { z } from 'zod';

const activateSchema = z.object({
  userId: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const actor = requireAuth(request);
    const body = await request.json();
    const { userId } = activateSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: { select: { name: true } } }
    });
    if (!user) {
      console.error('[ACTIVATE] User not found:', userId);
      return createCorsResponse({ status: 'error', message: 'User tidak ditemukan' }, 404);
    }
    // Role check: SUPERADMIN hanya boleh aktifkan ADMIN, ADMIN hanya boleh aktifkan TERAPIS
    if (user.role?.name === 'ADMIN' && actor.peran !== 'SUPERADMIN') {
      console.error('[ACTIVATE] Forbidden: Only superadmin can activate admin. Actor:', actor);
      return createCorsResponse({ status: 'error', message: 'Hanya superadmin yang dapat mengaktifkan admin.' }, 403);
    }
    if (user.role?.name === 'TERAPIS' && actor.peran !== 'ADMIN') {
      console.error('[ACTIVATE] Forbidden: Only admin can activate terapis. Actor:', actor);
      return createCorsResponse({ status: 'error', message: 'Hanya admin yang dapat mengaktifkan terapis.' }, 403);
    }
    if (user.status === 'active') {
      console.error('[ACTIVATE] User already active:', userId);
      return createCorsResponse({ status: 'error', message: 'User sudah aktif.' }, 400);
    }
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'active' },
    });
    return createCorsResponse({ status: 'success', message: 'User berhasil diaktifkan.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[ACTIVATE] Zod validation error:', error.errors);
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400);
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      console.error('[ACTIVATE] Unauthorized:', error);
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    console.error('[ACTIVATE] Server error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse();
} 