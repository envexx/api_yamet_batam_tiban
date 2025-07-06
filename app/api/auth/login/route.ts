import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// Validation schema
const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(1),
}).refine(data => data.email || data.phone, {
  message: 'Email atau phone harus diisi',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    const validatedData = loginSchema.parse(body);
    // Find user by email atau phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(validatedData.email ? [{ email: validatedData.email }] : []),
          ...(validatedData.phone ? [{ phone: validatedData.phone }] : []),
        ],
      },
      include: { 
        role: true,
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
      return createCorsResponse(
        { status: 'error', message: 'Email/phone atau password salah' },
        400,
        request
      );
    }
    // Check if user is active (pakai status)
    if (user.status !== 'active') {
      return createCorsResponse(
        { status: 'error', message: 'Akun tidak aktif. Silakan hubungi admin.' },
        400,
        request
      );
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return createCorsResponse(
        { status: 'error', message: 'Email/phone atau password salah' },
        400,
        request
      );
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        peran: user.role?.name,
        status: user.status,
        created_by: user.created_by,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    // Return user data without password
    const userData = {
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
    };
    return createCorsResponse({
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        user: userData,
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createCorsResponse(
        { status: 'error', message: 'Data tidak valid', errors: error.errors },
        400,
        request
      );
    }
    console.error('Login error:', error);
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