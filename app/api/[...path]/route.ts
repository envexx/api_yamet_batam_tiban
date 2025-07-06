import { NextRequest, NextResponse } from 'next/server';
import { createCorsOptionsResponse } from '../../lib/cors';

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 