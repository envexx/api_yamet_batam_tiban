import { createCorsResponse } from '@/app/lib/cors';

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.yametbatamtiban.id',
        corsOrigin: process.env.CORS_ORIGIN || 'https://admin.yametbatamtiban.id',
      },
    };

    return createCorsResponse(healthData);
  } catch (error) {
    return createCorsResponse(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

export async function OPTIONS() {
  return createCorsResponse({}, 200);
} 