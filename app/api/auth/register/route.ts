import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['SUPERADMIN', 'MANAJER', 'ADMIN', 'TERAPIS', 'ORANGTUA']),
}).refine(data => data.email || data.phone, {
  message: 'Email atau phone harus diisi',
});

// Helper function to handle user registration
async function handleRegistration(validatedData: any, createdBy: number | null, request: NextRequest) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        validatedData.email ? { email: validatedData.email } : null,
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
  const role = await prisma.role.findUnique({ where: { name: validatedData.role } });
  if (!role) {
    return createCorsResponse(
      { status: 'error', message: 'Role tidak valid' },
      400,
      request
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Determine status based on who created the user
  const status = createdBy ? 'active' : 'pending';

  // Create user
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      password: hashedPassword,
      role_id: role.id,
      status: status,
      created_by: createdBy,
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
    message: 'User berhasil dibuat',
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
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated (for role-based registration)
    let actor = null;
    try {
      actor = requireAuth(request);
    } catch (error) {
      // If not authenticated, allow public registration for ORANGTUA only
      const body = await request.json();
      const validatedData = registerSchema.parse(body);
      
      if (validatedData.role !== 'ORANGTUA') {
        return createCorsResponse(
          { status: 'error', message: 'Registrasi publik hanya untuk orang tua' },
          403,
          request
        );
      }
      
      // Continue with public registration
      return await handleRegistration(validatedData, null, request);
    }

    // If authenticated, check permissions
    if (!['SUPERADMIN', 'ADMIN'].includes(actor.peran)) {
      return createCorsResponse(
        { status: 'error', message: 'Hanya superadmin dan admin yang dapat membuat user' },
        403,
        request
      );
    }

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Role-based permission checks
    if (actor.peran === 'ADMIN') {
      // Admin can only create TERAPIS and ORANGTUA
      if (!['TERAPIS', 'ORANGTUA'].includes(validatedData.role)) {
        return createCorsResponse(
          { status: 'error', message: 'Admin hanya dapat membuat terapis dan orang tua' },
          403,
          request
        );
      }
    } else if (actor.peran === 'SUPERADMIN') {
      // Superadmin can create ADMIN, MANAJER, TERAPIS, ORANGTUA (but not SUPERADMIN)
      if (validatedData.role === 'SUPERADMIN') {
        return createCorsResponse(
          { status: 'error', message: 'Superadmin tidak dapat membuat superadmin lain' },
          403,
          request
        );
      }
    }

    return await handleRegistration(validatedData, actor.id, request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createCorsResponse(
        { status: 'error', message: 'Data tidak valid', errors: error.errors },
        400,
        request
      );
    }
    console.error('Register error:', error);
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