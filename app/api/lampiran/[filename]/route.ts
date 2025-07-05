import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new Response(JSON.stringify({ 
        status: 'error', 
        message: 'Nama file tidak valid' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'lampiran', filename);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ 
        status: 'error', 
        message: 'File tidak ditemukan' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);
    const mimeType = mime.getType(filePath) || 'application/octet-stream';
    
    // Get original filename (remove timestamp prefix)
    const originalFilename = filename.replace(/^\d+-/, '');

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${originalFilename}"`,
        'Content-Length': stats.size.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: 'Terjadi kesalahan saat mengunduh file' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 