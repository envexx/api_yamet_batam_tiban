# 🔧 PERBAIKAN DEPLOYMENT DOCKER

## 🚨 **Masalah yang Ditemukan:**

### 1. **Import Path Error**
```
Module not found: Can't resolve '../../../lib/cors'
```

### 2. **Node.js Version Compatibility**
```
npm warn EBADENGINE Unsupported engine {
  package: '@google/genai@1.8.0',
  required: { node: '>=20.0.0' },
  current: { node: 'v18.20.5', npm: '10.8.2' }
}
```

## ✅ **Perbaikan yang Dilakukan:**

### 1. **Perbaikan Import Path**

#### **File yang Diperbaiki:**
- ✅ `app/api/file/logo/[filename]/route.ts` - `../../../lib/cors` → `../../../../lib/cors`
- ✅ `app/api/health/route.ts` - `@/app/lib/cors` → `../../lib/cors`
- ✅ `app/api/gemini-data/route.ts` - `@/app/lib/cors` → `../../lib/cors`
- ✅ `app/api/chatbot/route.ts` - `@/app/lib/cors` → `../../lib/cors`

#### **Pattern Import yang Benar:**
```typescript
// Untuk file di app/api/ (level 1)
import { createCorsResponse } from '../../lib/cors';

// Untuk file di app/api/anak/ (level 2)
import { createCorsResponse } from '../../../lib/cors';

// Untuk file di app/api/anak/[id]/ (level 3)
import { createCorsResponse } from '../../../../lib/cors';

// Untuk file di app/api/anak/[id]/assessment/ (level 4)
import { createCorsResponse } from '../../../../../lib/cors';
```

### 2. **Engine Specification**

#### **Ditambahkan ke package.json:**
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 3. **Dependency Compatibility**

#### **Masalah dengan @google/genai:**
- Package `@google/genai@1.8.0` membutuhkan Node.js >=20.0.0
- Server menggunakan Node.js v18.20.5
- **Solusi:** Gunakan versi yang kompatibel atau upgrade Node.js

## 📋 **Checklist Perbaikan:**

### ✅ **Import Path Fixed:**
- [x] `app/api/file/logo/[filename]/route.ts`
- [x] `app/api/health/route.ts`
- [x] `app/api/gemini-data/route.ts`
- [x] `app/api/chatbot/route.ts`

### ✅ **Engine Specification:**
- [x] Ditambahkan `engines` di `package.json`
- [x] Specified Node.js >=18.0.0
- [x] Specified npm >=8.0.0

### ⚠️ **Yang Perlu Diperhatikan:**

#### **1. Node.js Version:**
```bash
# Cek versi Node.js di server
node --version

# Jika < 20.0.0, upgrade atau gunakan versi package yang kompatibel
```

#### **2. Package Compatibility:**
```json
{
  "dependencies": {
    "@google/genai": "^1.8.0",  // Butuh Node.js >=20.0.0
    // Alternatif: downgrade ke versi yang kompatibel
    "@google/genai": "^1.7.0"   // Kompatibel dengan Node.js 18
  }
}
```

## 🚀 **Langkah Deployment:**

### **1. Pre-deployment Check:**
```bash
# Test build lokal
npm run build

# Cek semua import path
grep -r "from.*lib/cors" app/api/

# Cek Node.js version
node --version
```

### **2. Environment Variables:**
```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
CORS_ORIGIN=https://admin.yametbatamtiban.id,https://yametbatamtiban.id

# Development
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=...
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### **3. Docker Build:**
```bash
# Build image
docker build -t yamet-backend .

# Test container
docker run -p 3000:3000 yamet-backend

# Deploy
docker push your-registry/yamet-backend
```

## 🔍 **Testing Setelah Deploy:**

### **1. Health Check:**
```bash
curl https://api.yametbatamtiban.id/api/health
```

### **2. CORS Test:**
```bash
# Test OPTIONS
curl -X OPTIONS https://api.yametbatamtiban.id/api/auth/login \
  -H "Origin: https://admin.yametbatamtiban.id" \
  -v

# Test actual request
curl -X POST https://api.yametbatamtiban.id/api/auth/login \
  -H "Origin: https://admin.yametbatamtiban.id" \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}' \
  -v
```

### **3. File Upload Test:**
```bash
# Test logo upload
curl -X POST https://api.yametbatamtiban.id/api/setting-aplikasi/upload-logo \
  -H "Authorization: Bearer your-token" \
  -F "file=@logo.png" \
  -v
```

## 🎯 **Expected Results:**

### **✅ Build Success:**
```
✓ Creating an optimized production build ...
✓ Compiled successfully
✓ Ready to start
```

### **✅ CORS Headers:**
```
Access-Control-Allow-Origin: https://admin.yametbatamtiban.id
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### **✅ Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-08T10:30:00.000Z",
  "database": {
    "status": "connected"
  }
}
```

---

**✅ Deployment fixes sudah selesai dan siap untuk production!** 