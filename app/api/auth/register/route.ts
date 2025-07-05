import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    const validatedData = registerSchema.parse(body);
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
        400
      );
    }
    // Cari role_id dari tabel Role
    const role = await prisma.role.findUnique({ where: { name: validatedData.role } });
    if (!role) {
      return createCorsResponse(
        { status: 'error', message: 'Role tidak valid' },
        400
      );
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role_id: role.id,
        status: 'pending', // Default pending, bisa diubah sesuai role
        created_by: null, // Bisa diisi null atau pakai requireAuth jika perlu
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
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createCorsResponse(
        { status: 'error', message: 'Data tidak valid', errors: error.errors },
        400
      );
    }
    console.error('Register error:', error);
    return createCorsResponse(
      { status: 'error', message: 'Terjadi kesalahan server' },
      500
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse();
} 