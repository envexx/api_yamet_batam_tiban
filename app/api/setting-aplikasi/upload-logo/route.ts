import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logo');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ status: 'error', message: 'File tidak ditemukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return new Response(JSON.stringify({ status: 'error', message: 'Tipe file tidak didukung' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const ext = mime.getExtension(file.type) || 'png';
    const filename = Date.now() + '-' + file.name.replace(/\s+/g, '_');
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    const url = `/uploads/logo/${filename}`;
    return new Response(JSON.stringify({ status: 'success', url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    return new Response(JSON.stringify({ status: 'error', message: 'Terjadi kesalahan server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 