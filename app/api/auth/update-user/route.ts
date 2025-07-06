import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Validation schema for updating user
const updateUserSchema = z.object({
  userId: z.number(),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'MANAJER', 'TERAPIS', 'ORANGTUA']).optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const actor = requireAuth(request);
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: validated.userId },
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

    if (!targetUser) {
      return createCorsResponse({ status: 'error', message: 'User tidak ditemukan' }, 404, request);
    }

    // Role-based permission checks
    if (actor.peran === 'SUPERADMIN') {
      // Superadmin can update anyone except other superadmins
      if (targetUser.role?.name === 'SUPERADMIN' && targetUser.id !== actor.id) {
        return createCorsResponse({ 
          status: 'error', 
          message: 'Superadmin tidak dapat mengubah superadmin lain' 
        }, 403, request);
      }
    } else if (actor.peran === 'ADMIN') {
      // Admin can only update TERAPIS and ORANGTUA
      if (!['TERAPIS', 'ORANGTUA'].includes(targetUser.role?.name || '')) {
        return createCorsResponse({ 
          status: 'error', 
          message: 'Admin hanya dapat mengubah terapis dan orang tua' 
        }, 403, request);
      }
    } else {
      // Other roles cannot update users
      return createCorsResponse({ 
        status: 'error', 
        message: 'Tidak memiliki izin untuk mengubah user' 
      }, 403, request);
    }

    // Check if email is being changed and if it's already taken
    if (validated.email && validated.email !== targetUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email }
      });
      if (existingUser) {
        return createCorsResponse({ 
          status: 'error', 
          message: 'Email sudah digunakan oleh user lain' 
        }, 400, request);
      }
    }

    // Check if phone is being changed and if it's already taken
    if (validated.phone && validated.phone !== targetUser.phone) {
      const existingUser = await prisma.user.findFirst({
        where: { phone: validated.phone }
      });
      if (existingUser) {
        return createCorsResponse({ 
          status: 'error', 
          message: 'Phone sudah digunakan oleh user lain' 
        }, 400, request);
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date(),
    };

    if (validated.name) updateData.name = validated.name;
    if (validated.email) updateData.email = validated.email;
    if (validated.phone) updateData.phone = validated.phone;
    if (validated.status) updateData.status = validated.status;

    // Handle password update
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 10);
    }

    // Handle role update (only superadmin can change roles)
    if (validated.role && actor.peran === 'SUPERADMIN') {
      const newRole = await prisma.role.findUnique({ 
        where: { name: validated.role } 
      });
      if (!newRole) {
        return createCorsResponse({ 
          status: 'error', 
          message: 'Role tidak valid' 
        }, 400, request);
      }
      updateData.role_id = newRole.id;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: validated.userId },
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
      return createCorsResponse({ 
        status: 'error', 
        message: 'Data tidak valid', 
        errors: error.errors 
      }, 400, request);
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Token tidak valid.' 
      }, 401, request);
    }
    console.error('Update user error:', error);
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 