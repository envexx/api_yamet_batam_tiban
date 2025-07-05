import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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