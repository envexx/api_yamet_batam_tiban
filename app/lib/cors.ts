import { NextRequest, NextResponse } from 'next/server';

// Allowed origins for CORS
const allowedOrigins = [
  'https://admin.yametbatamtiban.id',
  'http://admin.yametbatamtiban.id', // tambahkan http juga
  'https://yametbatamtiban.id',
  'http://localhost:3000', // Development
  'http://localhost:3001', // Frontend development
];

// Get CORS origin based on request
function getCorsOrigin(request?: NextRequest): string {
  if (process.env.NODE_ENV === 'production') {
    if (request) {
      const origin = request.headers.get('origin');
      if (origin && allowedOrigins.includes(origin)) {
        return origin;
      }
    }
    return process.env.CORS_ORIGIN || 'https://admin.yametbatamtiban.id';
  }
  return '*'; // Allow all origins in development
}

export function getCorsHeaders(request?: NextRequest) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(request),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
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