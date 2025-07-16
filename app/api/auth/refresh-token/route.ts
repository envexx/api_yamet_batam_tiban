import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

export async function POST(request: NextRequest) {
  try {
    // Ambil refresh token dari cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/refreshToken=([^;]+)/);
    const refreshToken = match ? match[1] : null;
    if (!refreshToken) {
      return createCorsResponse({ status: 'error', message: 'Refresh token tidak ditemukan' }, 401, request);
    }
    // Verifikasi refresh token
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    } catch (err) {
      return createCorsResponse({ status: 'error', message: 'Refresh token tidak valid atau sudah expired' }, 401, request);
    }
    // Generate access token baru (25 menit)
    const accessToken = jwt.sign({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      peran: payload.peran,
      status: payload.status,
      created_by: payload.created_by,
      role_id: payload.role_id,
    }, process.env.JWT_SECRET!, { expiresIn: '25m' });
    // Generate refresh token baru (rolling, 1 jam dari sekarang)
    const newRefreshToken = jwt.sign({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      peran: payload.peran,
      status: payload.status,
      created_by: payload.created_by,
      role_id: payload.role_id,
    }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    // Set refresh token baru di httpOnly cookie
    const response = createCorsResponse({
      status: 'success',
      message: 'Token berhasil diperbarui',
      data: {
        accessToken,
      }
    }, 200, request);
    response.headers.append('Set-Cookie', `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);
    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 