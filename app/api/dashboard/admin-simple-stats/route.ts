import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Hanya SUPERADMIN dan MANAJER yang bisa akses
    if (!['SUPERADMIN', 'MANAJER'].includes(user.peran)) {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Hanya untuk superadmin dan manajer.' 
      }, 403, request);
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all|1month|4month|6month|1year
    
    // Get current date
    const now = new Date();
    
    // Filter waktu berdasarkan period
    let filterStart: Date | null = null;
    
    if (period === '1month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (period === '4month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate());
    } else if (period === '6month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    } else if (period === '1year') {
      filterStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    
    // Ambil semua admin yang aktif
    const adminUsers = await prisma.user.findMany({
      where: { 
        status: 'active', 
        role: { name: 'ADMIN' } 
      },
      select: {
        id: true,
        name: true
      }
    });
    
    // Hitung jumlah inputan per admin (versi sederhana)
    const adminSimpleStats = await Promise.all(
      adminUsers.map(async (admin) => {
        // Filter waktu untuk setiap query
        const timeFilter = filterStart ? { gte: filterStart } : {};
        
        const [
          anakCount,
          penilaianCount,
          programCount,
          jadwalCount,
          sesiCount,
          ebookCount,
          kursusCount
        ] = await Promise.all([
          // Jumlah anak yang dibuat oleh admin ini
          prisma.anak.count({
            where: { 
              created_by: admin.id,
              deleted_at: null,
              created_at: timeFilter
            }
          }),
          
          // Jumlah penilaian yang dibuat oleh admin ini
          prisma.penilaianAnak.count({
            where: { 
              created_by: admin.id,
              created_at: timeFilter
            }
          }),
          
          // Jumlah program terapi yang dibuat oleh admin ini
          prisma.programTerapi.count({
            where: { 
              created_by: admin.id,
              created_at: timeFilter
            }
          }),
          
          // Jumlah jadwal terapi yang dibuat oleh admin ini
          prisma.jadwalTerapi.count({
            where: { 
              created_by: admin.id,
              created_at: timeFilter
            }
          }),
          
          // Jumlah sesi terapi yang dibuat oleh admin ini
          prisma.sesiTerapi.count({
            where: { 
              created_by: admin.id,
              created_at: timeFilter
            }
          }),
          
          // Jumlah ebook yang dibuat oleh admin ini
          prisma.ebook.count({
            where: { 
              created_by: admin.id,
              created_at: timeFilter
            }
          }),
          
          // Jumlah kursus yang dibuat oleh admin ini
          prisma.kursus.count({
            where: { 
              created_by: admin.id,
              created_at: timeFilter
            }
          })
        ]);
        
        const totalInput = anakCount + penilaianCount + programCount + jadwalCount + sesiCount + ebookCount + kursusCount;
        
        return {
          admin_name: admin.name,
          total_input: totalInput
        };
      })
    );
    
    // Urutkan berdasarkan total input (descending)
    adminSimpleStats.sort((a, b) => b.total_input - a.total_input);
    
    // Hitung total inputan dari semua admin
    const totalInputFromAllAdmins = adminSimpleStats.reduce((sum, admin) => sum + admin.total_input, 0);

    return createCorsResponse({
      status: 'success',
      message: 'Statistik sederhana inputan admin berhasil diambil',
      data: {
        period: period,
        filter_applied: filterStart ? filterStart.toISOString() : 'all_time',
        total_admin: adminUsers.length,
        total_input_from_all_admins: totalInputFromAllAdmins,
        admin_list: adminSimpleStats
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Token tidak valid.' 
      }, 401, request);
    }
    console.error('Admin simple stats error:', error);
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 