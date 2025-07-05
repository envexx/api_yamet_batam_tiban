import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

// Validation schema for creating/updating assessment
const assessmentSchema = z.object({
  assessment_date: z.string(),
  assessment_type: z.string(),
  assessment_result: z.string().optional(),
  notes: z.string().optional(),
});

// GET - List assessment for anak
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const anak_id = parseInt(id);
    if (isNaN(anak_id)) {
      return createCorsResponse({ status: 'error', message: 'ID anak tidak valid' }, 400);
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'assessment_date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;
    const where: any = { anak_id };
    const total = await prisma.penilaianAnak.count({ where });
    const assessments = await prisma.penilaianAnak.findMany({
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
      message: 'Assessment list fetched',
      data: assessments,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

// POST - Create assessment for anak
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403);
    }
    const { id } = await params;
    const anak_id = parseInt(id);
    if (isNaN(anak_id)) {
      return createCorsResponse({ status: 'error', message: 'ID anak tidak valid' }, 400);
    }
    const body = await request.json();
    const validated = assessmentSchema.parse(body);
    const assessment = await prisma.penilaianAnak.create({
      data: {
        anak_id,
        assessment_date: new Date(validated.assessment_date),
        assessment_type: validated.assessment_type,
        assessment_result: validated.assessment_result,
        notes: validated.notes,
        created_by: user.id,
      },
      include: {
        user_created: { select: { id: true, name: true } },
      },
    });
    return createCorsResponse({
      status: 'success',
      message: 'Assessment created',
      data: { assessment },
    }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    if (error instanceof z.ZodError) {
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

// PUT - Update assessment for anak
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403);
    }
    const { id } = await params;
    const anak_id = parseInt(id);
    const assessmentId = parseInt(new URL(request.url).searchParams.get('assessmentId') || '');
    if (isNaN(anak_id) || isNaN(assessmentId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400);
    }
    const body = await request.json();
    const validated = assessmentSchema.parse(body);
    const existing = await prisma.penilaianAnak.findFirst({ where: { id: assessmentId, anak_id } });
    if (!existing) {
      return createCorsResponse({ status: 'error', message: 'Assessment tidak ditemukan' }, 404);
    }
    const assessment = await prisma.penilaianAnak.update({
      where: { id: assessmentId },
      data: {
        assessment_date: new Date(validated.assessment_date),
        assessment_type: validated.assessment_type,
        assessment_result: validated.assessment_result,
        notes: validated.notes,
      },
      include: {
        user_created: { select: { id: true, name: true } },
      },
    });
    return createCorsResponse({
      status: 'success',
      message: 'Assessment updated',
      data: { assessment },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    if (error instanceof z.ZodError) {
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

// DELETE - Delete assessment for anak
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    if (!['SUPERADMIN', 'ADMIN'].includes(user.peran)) {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak.' }, 403);
    }
    const { id } = await params;
    const anak_id = parseInt(id);
    const assessmentId = parseInt(new URL(request.url).searchParams.get('assessmentId') || '');
    if (isNaN(anak_id) || isNaN(assessmentId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400);
    }
    const existing = await prisma.penilaianAnak.findFirst({ where: { id: assessmentId, anak_id } });
    if (!existing) {
      return createCorsResponse({ status: 'error', message: 'Assessment tidak ditemukan' }, 404);
    }
    await prisma.penilaianAnak.delete({ where: { id: assessmentId } });
    return createCorsResponse({ status: 'success', message: 'Assessment deleted' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401);
    }
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse();
} 