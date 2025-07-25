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
        name: true,
        email: true,
        created_at: true
      }
    });
    
    // Hitung jumlah inputan per admin
    const adminInputStats = await Promise.all(
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
          admin_id: admin.id,
          admin_name: admin.name,
          admin_email: admin.email,
          admin_created_at: admin.created_at,
          total_input: totalInput,
          detail: {
            anak: anakCount,
            penilaian: penilaianCount,
            program_terapi: programCount,
            jadwal_terapi: jadwalCount,
            sesi_terapi: sesiCount,
            ebook: ebookCount,
            kursus: kursusCount
          }
        };
      })
    );
    
    // Urutkan berdasarkan total input (descending)
    adminInputStats.sort((a, b) => b.total_input - a.total_input);
    
    // Hitung total inputan dari semua admin
    const totalInputFromAllAdmins = adminInputStats.reduce((sum, admin) => sum + admin.total_input, 0);
    
    // Hitung rata-rata inputan per admin
    const averageInputPerAdmin = adminUsers.length > 0 ? totalInputFromAllAdmins / adminUsers.length : 0;
    
    // Admin dengan inputan terbanyak
    const topPerformer = adminInputStats.length > 0 ? adminInputStats[0] : null;
    
    // Admin dengan inputan tersedikit
    const lowestPerformer = adminInputStats.length > 0 ? adminInputStats[adminInputStats.length - 1] : null;

    return createCorsResponse({
      status: 'success',
      message: 'Statistik inputan admin berhasil diambil',
      data: {
        period: period,
        filter_applied: filterStart ? filterStart.toISOString() : 'all_time',
        summary: {
          total_admin: adminUsers.length,
          total_input_from_all_admins: totalInputFromAllAdmins,
          average_input_per_admin: Math.round(averageInputPerAdmin * 100) / 100,
          top_performer: topPerformer ? {
            name: topPerformer.admin_name,
            total_input: topPerformer.total_input
          } : null,
          lowest_performer: lowestPerformer ? {
            name: lowestPerformer.admin_name,
            total_input: lowestPerformer.total_input
          } : null
        },
        admin_details: adminInputStats,
        breakdown_by_type: {
          total_anak: adminInputStats.reduce((sum, admin) => sum + admin.detail.anak, 0),
          total_penilaian: adminInputStats.reduce((sum, admin) => sum + admin.detail.penilaian, 0),
          total_program_terapi: adminInputStats.reduce((sum, admin) => sum + admin.detail.program_terapi, 0),
          total_jadwal_terapi: adminInputStats.reduce((sum, admin) => sum + admin.detail.jadwal_terapi, 0),
          total_sesi_terapi: adminInputStats.reduce((sum, admin) => sum + admin.detail.sesi_terapi, 0),
          total_ebook: adminInputStats.reduce((sum, admin) => sum + admin.detail.ebook, 0),
          total_kursus: adminInputStats.reduce((sum, admin) => sum + admin.detail.kursus, 0)
        }
      }
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Token tidak valid.' 
      }, 401, request);
    }
    console.error('Admin stats error:', error);
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 