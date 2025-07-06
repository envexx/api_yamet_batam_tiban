import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// Validation schema for creating admin
const createAdminSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'MANAJER', 'TERAPIS']), // Superadmin can only create these roles
}).refine(data => data.email || data.phone, {
  message: 'Email atau phone harus diisi',
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is superadmin
    const actor = requireAuth(request);
    if (actor.peran !== 'SUPERADMIN') {
      return createCorsResponse(
        { status: 'error', message: 'Akses hanya untuk superadmin.' },
        403,
        request
      );
    }

    const body = await request.json();
    const validatedData = createAdminSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          validatedData.phone ? { phone: validatedData.phone } : null,
        ].filter((v) => v !== null)
      }
    });

    if (existingUser) {
      return createCorsResponse(
        { status: 'error', message: 'Email atau phone sudah terdaftar' },
        400,
        request
      );
    }

    // Get role
    const role = await prisma.role.findUnique({ 
      where: { name: validatedData.role } 
    });
    
    if (!role) {
      return createCorsResponse(
        { status: 'error', message: 'Role tidak valid' },
        400,
        request
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with active status (since created by superadmin)
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role_id: role.id,
        status: 'active', // Directly active since created by superadmin
        created_by: actor.id, // Track who created this user
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
      }
    });

    return createCorsResponse({
      status: 'success',
      message: `${validatedData.role} berhasil dibuat oleh superadmin`,
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
        },
      },
    }, 201, request);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createCorsResponse(
        { status: 'error', message: 'Data tidak valid', errors: error.errors },
        400,
        request
      );
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse(
        { status: 'error', message: 'Akses ditolak. Token tidak valid.' },
        401,
        request
      );
    }
    console.error('Create admin error:', error);
    return createCorsResponse(
      { status: 'error', message: 'Terjadi kesalahan server' },
      500,
      request
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 