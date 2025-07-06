import { NextRequest, NextResponse } from 'next/server';

// Allowed origins for CORS
const allowedOrigins = [
  'https://admin.yametbatamtiban.id',
  'http://admin.yametbatamtiban.id',
  'https://yametbatamtiban.id',
  'http://localhost:3000',
  'http://localhost:3001',
];

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

export function getCorsHeaders(request?: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': getCorsOrigin(request),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
  console.log('[CORS] Response headers:', headers);
  return headers;
}

export function addCorsHeaders(response: NextResponse, request?: NextRequest): NextResponse {
  const headers = getCorsHeaders(request);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function createCorsResponse(data: any, status: number = 200, request?: NextRequest): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: getCorsHeaders(request),
  });
}

export function createCorsOptionsResponse(request?: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

// Validate origin for production
export function validateOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === 'production') {
    return allowedOrigins.includes(origin);
  }
  return true; // Allow all origins in development
} 