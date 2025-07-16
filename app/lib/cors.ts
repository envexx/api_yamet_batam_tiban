import { NextRequest, NextResponse } from 'next/server';

// Ambil allowedOrigins hanya dari env, fallback ke array kosong jika tidak ada
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : [];

// Get CORS origin based on request
function getCorsOrigin(request?: NextRequest): string {
  if (process.env.NODE_ENV === 'production') {
    if (request) {
      const origin = request.headers.get('origin');
      if (origin && allowedOrigins.includes(origin)) {
        console.log('[CORS] Allowing origin:', origin);
        return origin;
      } else {
        console.warn('[CORS] Blocked or unknown origin:', origin);
      }
    }
    // Fallback: tetap kirim header dengan null origin agar error lebih jelas di browser
    return 'null';
  }
  return '*'; // Allow all origins in development
}

export function createCorsResponse(
  data: any,
  status: number = 200,
  request?: NextRequest
) {
  const origin = getCorsOrigin(request);
  return new NextResponse(
    typeof data === 'string' ? data : JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
}

export function createCorsOptionsResponse(request: NextRequest) {
  const origin = getCorsOrigin(request);
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

// Validate origin for production
export function validateOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === 'production') {
    return allowedOrigins.includes(origin);
  }
  return true; // Allow all origins in development
} 