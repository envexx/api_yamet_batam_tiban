import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { createCorsResponse, createCorsOptionsResponse } from '../../lib/cors';

// OPTIONS - Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

// POST - Push seed data ke database (hanya untuk development)
export async function POST(request: NextRequest) {
  try {
    // Hanya izinkan di development
    if (process.env.NODE_ENV === 'production') {
      return createCorsResponse({ error: 'Not allowed in production' }, 403, request);
    }

    const body = await request.json();
    const { data } = body;

    if (!data) {
      return createCorsResponse({ error: 'Data diperlukan' }, 400, request);
    }

    // Push data ke database
    const seeded = await prisma.$transaction(async (tx) => {
      // Implementasi seeding sesuai kebutuhan
      console.log('Seeding data:', data);
      return { message: 'Data berhasil di-seed' };
    });

    return createCorsResponse({ success: true, seeded }, 200, request);
  } catch (err: any) {
    console.error('Error seeding data:', err);
    return createCorsResponse({ error: err.message || err.toString() }, 500, request);
  }
} 