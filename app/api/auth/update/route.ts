import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const userPayload = requireAuth(request);
    const body = await request.json();
    const validated = updateSchema.parse(body);
    
    // Get current user data first
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
      return createCorsResponse({ status: 'error', message: 'User tidak ditemukan' }, 404, request);
    }

    const updateData: any = {
      updated_at: new Date(),
    };
    if (validated.name) updateData.name = validated.name;
    if (validated.phone) updateData.phone = validated.phone;
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 10);
    }
    
    // Handle email update with uniqueness check
    if (validated.email && validated.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email }
      });
      if (existingUser) {
        return createCorsResponse({ 
          status: 'error', 
          message: 'Email sudah digunakan oleh user lain' 
        }, 400, request);
      }
      updateData.email = validated.email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userPayload.id },
      data: updateData,
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

    return createCorsResponse({
      status: 'success',
      message: 'User berhasil diupdate',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          peran: updatedUser.role?.name,
          status: updatedUser.status,
          created_at: updatedUser.created_at,
          updated_at: updatedUser.updated_at,
          created_by: updatedUser.created_by,
          role_id: updatedUser.role_id,
          creator: updatedUser.creator,
        },
      },
    }, 200, request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400, request);
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 