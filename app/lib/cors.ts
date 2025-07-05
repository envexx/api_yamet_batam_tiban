import { NextRequest, NextResponse } from 'next/server';

// Allowed origins for CORS
const allowedOrigins = [
  'https://admin.yametbatamtiban.id',
  'https://yametbatamtiban.id',
  'http://localhost:3000', // Development
  'http://localhost:3001', // Frontend development
];

// Get CORS origin based on environment
function getCorsOrigin(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CORS_ORIGIN || 'https://admin.yametbatamtiban.id';
  }
  return '*'; // Allow all origins in development
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': getCorsOrigin(),
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

export function addCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function createCorsResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}

export function createCorsOptionsResponse(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Validate origin for production
export function validateOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === 'production') {
    return allowedOrigins.includes(origin);
  }
  return true; // Allow all origins in development
} 