import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const anakId = parseInt(id);
    if (isNaN(anakId)) {
      return NextResponse.json({ status: 'error', message: 'ID tidak valid' }, { status: 400 });
    }
    // Parse multipart form
    const formData = await request.formData();
    // Field yang didukung (harus sama dengan field di model Lampiran)
    const SUPPORTED_FIELDS = [
      'hasil_eeg_url',
      'hasil_bera_url',
      'hasil_ct_scan_url',
      'program_terapi_3bln_url',
      'hasil_psikologis_psikiatris_url',
      'perjanjian',
      'keterangan_tambahan',
    ];
    const updateData: any = {};
    // Ambil data lampiran lama
    const existingLampiran = await prisma.lampiran.findFirst({ where: { anak_id: anakId } });
    for (const field of SUPPORTED_FIELDS) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        // Hapus file lama jika ada
        if (existingLampiran && (existingLampiran as any)[field]) {
          const oldPath = path.join(uploadDir, path.basename((existingLampiran as any)[field]));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        // Simpan file baru
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '-' + file.name.replace(/\s+/g, '_');
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        updateData[field] = `/uploads/lampiran/${filename}`;
      }
      // Jika ingin hapus file (set null), frontend bisa kirim field kosong/null
      if (file === null || (file && file.size === 0)) {
        // Hapus file lama jika ada
        if (existingLampiran && (existingLampiran as any)[field]) {
          const oldPath = path.join(uploadDir, path.basename((existingLampiran as any)[field]));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData[field] = null;
      }
    }
    // Update lampiran di database
    const lampiran = await prisma.lampiran.upsert({
      where: { anak_id: anakId },
      update: {
        ...updateData,
        perjanjian: updateData.perjanjian ?? null,
      },
      create: { anak_id: anakId, ...updateData, perjanjian: updateData.perjanjian ?? null },
    });
    return NextResponse.json({ status: 'success', message: 'Lampiran berhasil diupload', data: lampiran });
  } catch (error) {
    console.error('Upload lampiran error:', error);
    return NextResponse.json({ status: 'error', message: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 