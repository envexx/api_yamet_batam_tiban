import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

// Setup Multer storage
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'lampiran');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

export const runtime = 'nodejs';

// OPTIONS - Handle preflight request
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

// POST - Upload lampiran untuk anak
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return createCorsResponse({ error: 'Token tidak ditemukan' }, 401, request);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return createCorsResponse({ error: 'Token tidak valid' }, 401, request);
    }

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400, request);
    }

    // Cek apakah anak ada
    const anak = await prisma.anak.findUnique({
      where: { id: parseInt(id) }
    });

    if (!anak) {
      return createCorsResponse({ error: 'Data anak tidak ditemukan' }, 404, request);
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jenis_lampiran = formData.get('jenis_lampiran') as string;
    const keterangan = formData.get('keterangan') as string;

    if (!file || !jenis_lampiran) {
      return createCorsResponse({ 
        error: 'File dan jenis lampiran diperlukan' 
      }, 400, request);
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return createCorsResponse({ 
        error: 'Ukuran file terlalu besar. Maksimal 5MB.' 
      }, 400, request);
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return createCorsResponse({ 
        error: 'Tipe file tidak diizinkan. Hanya JPEG, PNG, GIF, dan PDF.' 
      }, 400, request);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const fileUrl = `/uploads/lampiran/${filename}`;

    // Simpan file ke disk (implementasi sesuai kebutuhan)
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    // await writeFile(`./public/uploads/lampiran/${filename}`, buffer);

    // Cek apakah lampiran untuk anak ini sudah ada
    const existingLampiran = await prisma.lampiran.findUnique({
      where: { anak_id: parseInt(id) }
    });

    // Update atau create lampiran berdasarkan jenis
    let lampiran;
    const updateData: any = {};

    switch (jenis_lampiran) {
      case 'hasil_eeg':
        updateData.hasil_eeg_url = fileUrl;
        break;
      case 'hasil_bera':
        updateData.hasil_bera_url = fileUrl;
        break;
      case 'hasil_ct_scan':
        updateData.hasil_ct_scan_url = fileUrl;
        break;
      case 'program_terapi_3bln':
        updateData.program_terapi_3bln_url = fileUrl;
        break;
      case 'hasil_psikologis_psikiatris':
        updateData.hasil_psikologis_psikiatris_url = fileUrl;
        break;
      case 'perjanjian':
        updateData.perjanjian = fileUrl;
        break;
      default:
        return createCorsResponse({ 
          error: 'Jenis lampiran tidak valid' 
        }, 400, request);
    }

    if (keterangan) {
      updateData.keterangan_tambahan = keterangan;
    }

    if (existingLampiran) {
      // Update lampiran yang sudah ada
      lampiran = await prisma.lampiran.update({
        where: { anak_id: parseInt(id) },
        data: updateData,
        include: {
          anak: {
            select: {
              id: true,
              full_name: true,
            }
          }
        }
      });
    } else {
      // Create lampiran baru
      lampiran = await prisma.lampiran.create({
        data: {
          anak_id: parseInt(id),
          ...updateData
        },
        include: {
          anak: {
            select: {
              id: true,
              full_name: true,
            }
          }
        }
      });
    }

    return createCorsResponse({ 
      status: 'success', 
      message: 'Lampiran berhasil diupload', 
      data: lampiran 
    }, 200, request);
  } catch (error) {
    console.error('Error uploading lampiran:', error);
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
} 