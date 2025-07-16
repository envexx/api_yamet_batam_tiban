import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Validasi nama file agar tidak bisa akses file sembarangan
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new Response(JSON.stringify({ status: 'error', message: 'Nama file tidak valid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Path ke file logo (samakan dengan path upload di backend)
    const filePath = process.env.NODE_ENV === 'production'
      ? path.join('/app/public/uploads/logo', filename)
      : path.join(process.cwd(), 'public', 'uploads', 'logo', filename);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ status: 'error', message: 'File tidak ditemukan' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath) || 'application/octet-stream';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Serve file error:', error);
    return new Response(JSON.stringify({ status: 'error', message: 'Terjadi kesalahan server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 