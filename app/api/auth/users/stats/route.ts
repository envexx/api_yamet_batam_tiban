import { NextRequest } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Only SUPERADMIN can access this endpoint
    if (user.peran !== 'SUPERADMIN') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses hanya untuk superadmin.' 
      }, 403, request);
    }

    // Get statistics
    const [
      totalUsers,
      totalAdmin,
      totalTerapis,
      totalOrangTua,
      activeUsers,
      inactiveUsers,
      pendingUsers,
      usersThisMonth,
      usersLastMonth,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Users by role
      prisma.user.count({ where: { role: { name: 'ADMIN' } } }),
      prisma.user.count({ where: { role: { name: 'TERAPIS' } } }),
      prisma.user.count({ where: { role: { name: 'ORANGTUA' } } }),
      
      // Users by status
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { status: 'inactive' } }),
      prisma.user.count({ where: { status: 'pending' } }),
      
      // Users created this month
      prisma.user.count({
        where: {
          created_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      }),
      
      // Users created last month
      prisma.user.count({
        where: {
          created_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Calculate growth percentage
    const growthPercentage = usersLastMonth > 0 
      ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100 
      : 0;

    return createCorsResponse({
      status: 'success',
      message: 'Statistik user berhasil diambil',
      data: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          pendingUsers,
        },
        byRole: {
          admin: totalAdmin,
          terapis: totalTerapis,
          orangTua: totalOrangTua,
        },
        growth: {
          thisMonth: usersThisMonth,
          lastMonth: usersLastMonth,
          growthPercentage: Math.round(growthPercentage * 100) / 100,
        },
        percentages: {
          activePercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
          inactivePercentage: totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0,
          pendingPercentage: totalUsers > 0 ? Math.round((pendingUsers / totalUsers) * 100) : 0,
        },
      },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Akses ditolak. Token tidak valid.' 
      }, 401, request);
    }
    return createCorsResponse({ 
      status: 'error', 
      message: 'Terjadi kesalahan server' 
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 