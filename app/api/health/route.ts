import { createCorsResponse } from '../../lib/cors';
import { prisma } from '../../lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    let databaseStatus = 'disconnected';
    let databaseError = null;
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'connected';
    } catch (dbError) {
      databaseError = dbError instanceof Error ? dbError.message : 'Database connection failed';
    }

    // Get basic system info
    const healthData = {
      status: databaseStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: databaseStatus,
        error: databaseError,
        provider: process.env.DATABASE_URL ? 'PostgreSQL' : 'Unknown',
      },
      api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.yametbatamtiban.id',
        corsOrigin: process.env.CORS_ORIGIN || 'https://admin.yametbatamtiban.id',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          anak: '/api/anak',
          dashboard: '/api/dashboard/stats',
          assessment: '/api/assessment',
          programTerapi: '/api/program-terapi',
        }
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      }
    };

    return createCorsResponse(healthData, 200, request);
  } catch (error) {
    return createCorsResponse(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        database: {
          status: 'unknown',
          error: 'Health check failed',
        }
      },
      500,
      request
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsResponse({}, 200, request);
} 