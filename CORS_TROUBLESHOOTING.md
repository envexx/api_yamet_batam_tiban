# 🔧 CORS Troubleshooting Guide

## 🚨 Masalah yang Ditemukan

### Error CORS
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login' from origin 'http://localhost:5174' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Root Cause
1. **Port Mismatch**: Frontend berjalan di port 5174, backend di port 3002
2. **CORS Headers**: Belum ada konfigurasi CORS di Next.js
3. **Preflight Requests**: OPTIONS request tidak ditangani

## ✅ Solusi yang Telah Diimplementasikan

### 1. Middleware CORS
```typescript
// app/middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
```

### 2. CORS Utility Functions
```typescript
// app/lib/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function createCorsResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}
```

### 3. OPTIONS Handler
```typescript
// Setiap API route
export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse();
}
```

### 4. Updated API Routes
Semua API routes telah diperbarui untuk menggunakan:
- `createCorsResponse()` untuk responses
- `createCorsOptionsResponse()` untuk OPTIONS requests
- Proper CORS headers di semua responses

## 🔧 Konfigurasi Frontend

### Update API Base URL
Pastikan frontend menggunakan port yang benar:

```typescript
// Di frontend, update API base URL
const API_BASE_URL = 'http://localhost:3002/api'; // Bukan 3000
```

### Axios Configuration
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Untuk development
});

// Add request interceptor untuk token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🧪 Testing CORS

### 1. Test OPTIONS Request
```bash
curl -X OPTIONS http://localhost:3002/api/auth/login \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v
```

### 2. Test POST Request
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Origin: http://localhost:5174" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@yametbatamtiban.com","kata_sandi":"Superadminyamet"}' \
  -v
```

## 🔍 Debugging Steps

### 1. Check Server Port
```bash
# Pastikan server berjalan di port yang benar
npm run dev
# Should show: Local: http://localhost:3002
```

### 2. Check CORS Headers
```bash
# Test dengan curl untuk melihat headers
curl -I http://localhost:3002/api/auth/login
```

### 3. Browser Developer Tools
- Buka Network tab
- Lihat request headers dan response headers
- Pastikan CORS headers ada di response

## 🚀 Production Configuration

### Environment Variables
```env
# Development
CORS_ORIGIN=http://localhost:5174

# Production
CORS_ORIGIN=https://yourdomain.com
```

### Conditional CORS
```typescript
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

export const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins[0],
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
```

## 📋 Checklist

- [x] Middleware CORS diimplementasikan
- [x] Utility functions untuk CORS dibuat
- [x] Semua API routes menggunakan CORS headers
- [x] OPTIONS handler ditambahkan
- [x] Frontend menggunakan port yang benar (3002)
- [ ] Test dengan Postman/Thunder Client
- [ ] Test dengan frontend application

## 🎯 Next Steps

1. **Update Frontend**: Pastikan frontend menggunakan port 3002
2. **Test API**: Test semua endpoints dengan Postman
3. **Monitor Logs**: Perhatikan error logs di console
4. **Production Setup**: Konfigurasi CORS untuk production

---

**💡 Tips**: Jika masih ada masalah CORS, coba:
1. Clear browser cache
2. Restart development server
3. Check browser console untuk error details
4. Verify API endpoints dengan Postman 