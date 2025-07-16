import { NextRequest } from 'next/server';
import { prisma } from '../../lib/prisma';
import { createCorsResponse, createCorsOptionsResponse } from '../../lib/cors';
import { z } from 'zod';

const settingSchema = z.object({
  appName: z.string().min(1, 'Nama aplikasi wajib diisi'),
  logoUrl: z.string().min(1, 'Logo wajib diisi'),
  colorSchema: z.string().min(1, 'Color schema wajib diisi'),
});

export async function GET(request: NextRequest) {
  try {
    const config = await prisma.appConfig.findFirst();
    if (!config) {
      // Return default data jika belum ada
      return createCorsResponse({
        status: 'success',
        data: {
          appName: null,
          logoUrl: null,
          colorSchema: null,
        }
      }, 200, request);
    }
    return createCorsResponse({
      status: 'success',
      data: {
        appName: config.appName,
        logoUrl: config.logoUrl,
        colorSchema: config.colorSchema,
      }
    }, 200, request);
  } catch (error) {
    console.error('Setting Aplikasi error:', error);
    return createCorsResponse({
      status: 'error',
      message: 'Terjadi kesalahan server',
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = settingSchema.parse(body);
    // Cek apakah sudah ada config
    let config = await prisma.appConfig.findFirst();
    if (config) {
      config = await prisma.appConfig.update({
        where: { id: config.id },
        data: {
          appName: validated.appName,
          logoUrl: validated.logoUrl,
          colorSchema: validated.colorSchema,
        },
      });
    } else {
      config = await prisma.appConfig.create({
        data: {
          appName: validated.appName,
          logoUrl: validated.logoUrl,
          colorSchema: validated.colorSchema,
        },
      });
    }
    return createCorsResponse({
      status: 'success',
      message: 'Konfigurasi aplikasi berhasil disimpan',
      data: {
        appName: config.appName,
        logoUrl: config.logoUrl,
        colorSchema: config.colorSchema,
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createCorsResponse({
        status: 'error',
        message: 'Data tidak valid',
        errors: error.errors,
      }, 400, request);
    }
    console.error('Setting Aplikasi PUT error:', error);
    return createCorsResponse({
      status: 'error',
      message: 'Terjadi kesalahan server',
    }, 500, request);
  }
} 