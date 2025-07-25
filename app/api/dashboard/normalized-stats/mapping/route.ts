import { NextRequest } from 'next/server';
import { createCorsResponse, createCorsOptionsResponse } from '../../../../lib/cors';
import { addKeluhanMapping, addSumberMapping, getMappings } from '../../../../lib/data-normalizer';

export async function POST(request: NextRequest) {
  try {
    // Endpoint ini tidak memerlukan authentication karena untuk development/testing
    const body = await request.json();
    const { type, original, normalized } = body;
    
    if (!type || !original || !normalized) {
      return createCorsResponse({
        status: 'error',
        message: 'Parameter type, original, dan normalized harus diisi'
      }, 400, request);
    }
    
    if (type === 'keluhan') {
      addKeluhanMapping(original, normalized);
    } else if (type === 'sumber') {
      addSumberMapping(original, normalized);
    } else {
      return createCorsResponse({
        status: 'error',
        message: 'Type harus "keluhan" atau "sumber"'
      }, 400, request);
    }
    
    return createCorsResponse({
      status: 'success',
      message: `Mapping ${type} berhasil ditambahkan`,
      data: {
        type,
        original,
        normalized
      }
    }, 200, request);
  } catch (error) {
    console.error('Add mapping error:', error);
    return createCorsResponse({
      status: 'error',
      message: 'Terjadi kesalahan server'
    }, 500, request);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Endpoint ini tidak memerlukan authentication karena untuk development/testing
    const mappings = getMappings();
    
    return createCorsResponse({
      status: 'success',
      message: 'Mapping berhasil diambil',
      data: mappings
    }, 200, request);
  } catch (error) {
    console.error('Get mapping error:', error);
    return createCorsResponse({
      status: 'error',
      message: 'Terjadi kesalahan server'
    }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 