import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logo');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const runtime = 'nodejs';

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return createCorsResponse({ status: 'error', message: 'File tidak ditemukan' }, 400, request);
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return createCorsResponse({ status: 'error', message: 'Tipe file tidak didukung' }, 400, request);
    }
    const ext = mime.getExtension(file.type) || 'png';
    const filename = Date.now() + '-' + file.name.replace(/\s+/g, '_');
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    // Debug: cek apakah file benar-benar ada setelah ditulis
    if (!fs.existsSync(filepath)) {
      console.error('[UPLOAD LOGO] File gagal ditulis:', filepath);
      return createCorsResponse({ status: 'error', message: 'File gagal disimpan di server' }, 500, request);
    }
    // Kembalikan hanya nama file, bukan path lengkap
    return createCorsResponse({ status: 'success', filename }, 200, request);
  } catch (error) {
    console.error('Upload logo error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
} 