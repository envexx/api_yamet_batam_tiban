import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

const programSchema = z.object({
  program_name: z.string().min(2),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['AKTIF', 'SELESAI', 'DIBATALKAN']).default('AKTIF'),
});

// GET - List program terapi anak
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const anak_id = parseInt(id);
    if (isNaN(anak_id)) {
      return createCorsResponse({ status: 'error', message: 'ID anak tidak valid' }, 400, request);
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;
    const where: any = { anak_id };
    const total = await prisma.programTerapi.count({ where });
    const programs = await prisma.programTerapi.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder.toLowerCase() },
      include: {
        user_created: { select: { id: true, name: true } },
      },
    });
    const totalPages = Math.ceil(total / limit);
    return createCorsResponse({
      status: 'success',
      message: 'Program list fetched',
      data: programs,
      pagination: { page, limit, total, totalPages },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// POST - Create program terapi anak
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403, request);
    }
    const { id } = await params;
    const anak_id = parseInt(id);
    if (isNaN(anak_id)) {
      return createCorsResponse({ status: 'error', message: 'ID anak tidak valid' }, 400, request);
    }
    const body = await request.json();
    const validated = programSchema.parse(body);
    const program = await prisma.programTerapi.create({
      data: {
        anak_id,
        program_name: validated.program_name,
        description: validated.description,
        start_date: validated.start_date ? new Date(validated.start_date) : null,
        end_date: validated.end_date ? new Date(validated.end_date) : null,
        status: validated.status,
        created_by: user.id,
      },
      include: {
        user_created: { select: { id: true, name: true } },
      },
    });
    return createCorsResponse({
      status: 'success',
      message: 'Program created',
      data: { program },
    }, 201, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    if (error instanceof z.ZodError) {
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400, request);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// PUT - Update program terapi anak
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403, request);
    }
    const { id } = await params;
    const anak_id = parseInt(id);
    const programId = parseInt(new URL(request.url).searchParams.get('programId') || '');
    if (isNaN(anak_id) || isNaN(programId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400, request);
    }
    const body = await request.json();
    const validated = programSchema.parse(body);
    const existing = await prisma.programTerapi.findFirst({ where: { id: programId, anak_id } });
    if (!existing) {
      return createCorsResponse({ status: 'error', message: 'Program tidak ditemukan' }, 404, request);
    }
    const program = await prisma.programTerapi.update({
      where: { id: programId },
      data: {
        program_name: validated.program_name,
        description: validated.description,
        start_date: validated.start_date ? new Date(validated.start_date) : null,
        end_date: validated.end_date ? new Date(validated.end_date) : null,
        status: validated.status,
      },
      include: {
        user_created: { select: { id: true, name: true } },
      },
    });
    return createCorsResponse({
      status: 'success',
      message: 'Program updated',
      data: { program },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    if (error instanceof z.ZodError) {
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400, request);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// DELETE - Delete program terapi anak
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403, request);
    }
    const { id } = await params;
    const anak_id = parseInt(id);
    const programId = parseInt(new URL(request.url).searchParams.get('programId') || '');
    if (isNaN(anak_id) || isNaN(programId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400, request);
    }
    const existing = await prisma.programTerapi.findFirst({ where: { id: programId, anak_id } });
    if (!existing) {
      return createCorsResponse({ status: 'error', message: 'Program tidak ditemukan' }, 404, request);
    }
    await prisma.programTerapi.delete({ where: { id: programId } });
    return createCorsResponse({ status: 'success', message: 'Program deleted' }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 