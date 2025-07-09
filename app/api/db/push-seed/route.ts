import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    // Jalankan prisma db push
    const { execSync } = await import('child_process');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Cek apakah tabel User sudah ada data
    const userCount = await prisma.user.count();

    // Jika belum ada data, jalankan seed
    let seeded = false;
    if (userCount === 0) {
      execSync('npx prisma db seed', { stdio: 'inherit' });
      seeded = true;
    }
    await prisma.$disconnect();

    return NextResponse.json({ success: true, seeded });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err.toString() }, { status: 500 });
  }
} 