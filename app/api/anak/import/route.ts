import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { Readable } from 'stream';

// Helper to parse form-data file upload in Next.js API route
function runMiddleware(req: any, res: any, fn: (...args: any[]) => void) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (user.peran !== 'ADMIN') {
      return createCorsResponse({ status: 'error', message: 'Akses hanya untuk admin.' }, 403);
    }

    // Parse multipart form-data
    const req: any = request;
    const res: any = {};
    await runMiddleware(req, res, upload.single('file'));
    const file = req.file;
    if (!file) {
      return createCorsResponse({ status: 'error', message: 'File tidak ditemukan.' }, 400);
    }

    // Parse Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let success = 0;
    let failed = 0;
    let errors: any[] = [];

    for (const [i, rowAny] of (rows as any[]).entries()) {
      const row = rowAny as any;
      try {
        // Mapping kolom Excel ke field schema baru
        const data: any = {
          full_name: row['Full Name'] || row['full_name'],
          nick_name: row['Nick Name'] || row['nick_name'],
          birth_date: row['Birth Date'] ? new Date(row['Birth Date']) : null,
          birth_place: row['Birth Place'] || row['birth_place'],
          current_age: row['Current Age'] || row['current_age'],
          observation_age: row['Observation Age'] || row['observation_age'],
          dominant_hand: row['Dominant Hand'] || row['dominant_hand'],
          home_address: row['Home Address'] || row['home_address'],
          therapy_start: row['Therapy Start'] ? new Date(row['Therapy Start']) : null,
          therapy_end: row['Therapy End'] ? new Date(row['Therapy End']) : null,
          therapy_duration: row['Therapy Duration'] || row['therapy_duration'],
          status: row['Status'] || row['status'] || 'AKTIF',
          info_source: row['Info Source'] || row['info_source'],
          previous_therapy: row['Previous Therapy'] || row['previous_therapy'] || false,
          initial_complaint: row['Initial Complaint'] || row['initial_complaint'],
          initial_diagnosis: row['Initial Diagnosis'] || row['initial_diagnosis'],
          father_name: row['Father Name'] || row['father_name'],
          father_job: row['Father Job'] || row['father_job'],
          father_phone: row['Father Phone'] || row['father_phone'],
          mother_name: row['Mother Name'] || row['mother_name'],
          mother_job: row['Mother Job'] || row['mother_job'],
          mother_phone: row['Mother Phone'] || row['mother_phone'],
          family_address: row['Family Address'] || row['family_address'],
          created_by: user.id,
        };
        // Insert or update by unique nomor_anak
        let anak;
        if (row['Nomor Anak'] || row['nomor_anak']) {
          anak = await prisma.anak.upsert({
            where: { nomor_anak: row['Nomor Anak'] || row['nomor_anak'] },
            update: data,
            create: { ...data, nomor_anak: row['Nomor Anak'] || row['nomor_anak'] },
          });
        } else {
          // Generate nomor_anak jika tidak ada
          const year = new Date().getFullYear();
          const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const nomor_anak = `YAMET-${year}-${randomNum}`;
          anak = await prisma.anak.create({ data: { ...data, nomor_anak } });
        }
        success++;
      } catch (err: any) {
        failed++;
        errors.push({ row: i + 2, error: err.message });
      }
    }

    return createCorsResponse({
      status: 'success',
      message: 'Import selesai',
      imported: success,
      failed,
      errors,
    });
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