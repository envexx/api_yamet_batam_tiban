# 🏥 YAMET Backend API - Sistem Manajemen Anak Terapi

Backend API lengkap untuk sistem manajemen anak YAMET (Yayasan Anak Mandiri Terpadu) Batam Tiban. Sistem ini dirancang dengan arsitektur backend-heavy menggunakan Next.js App Router, Prisma ORM, dan PostgreSQL.

## 📋 Daftar Isi

- [🚀 Quick Start](#-quick-start)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [🔐 Sistem Authentication](#-sistem-authentication)
- [📊 Model Data & Database](#-model-data--database)
- [🌐 API Endpoints Lengkap](#-api-endpoints-lengkap)
- [🛠️ Fitur & CRUD Operations](#️-fitur--crud-operations)
- [📈 Dashboard & Statistik](#-dashboard--statistik)
- [🔒 Security & Middleware](#-security--middleware)
- [📋 Environment Configuration](#-environment-configuration)
- [🚀 Deployment Guide](#-deployment-guide)
- [📚 Documentation Files](#-documentation-files)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm atau yarn
- PostgreSQL database

### Installation & Setup

```bash
# Clone repository
git clone <repository-url>
cd yamet-backend-next

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file dengan konfigurasi database PostgreSQL

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database dengan data awal
npm run db:seed

# Start development server
npm run dev

# Untuk production
npm run build
npm start
```

### Default Credentials
```json
{
  "superadmin": {
    "email": "superadmin@yametbatamtiban.com",
    "password": "Superadminyamet"
  },
  "admin": {
    "email": "admin@yametbatamtiban.com",
    "password": "Adminyamet123"
  }
}
```

## 🏗️ Arsitektur Sistem

### Teknologi Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs, zod validation
- **Language:** TypeScript

### Struktur Folder
```
yamet-backend-next/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── anak/              # Anak management endpoints
│   │   └── dashboard/         # Dashboard & stats endpoints
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # Authentication utilities
│   │   └── prisma.ts         # Prisma client
│   └── generated/             # Generated Prisma client
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seeder
├── public/                   # Static files
└── package.json
```

## 🔐 Sistem Authentication

### User Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| **SUPERADMIN** | Full access | Akses penuh ke semua fitur sistem |
| **ADMIN** | Limited access | Akses terbatas, perlu approval superadmin |
| **TERAPIS** | Anak access | Akses untuk data anak dan terapi |

### Authentication Flow

1. **Register** → User registration (pending approval)
2. **Login** → JWT token generation
3. **Token Validation** → Middleware checks
4. **Role Authorization** → Access control
5. **Active Status Check** → User status validation

### JWT Token Structure
```json
{
  "id": 1,
  "email": "user@example.com",
  "peran": "SUPERADMIN",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## 📊 Model Data & Database

### Database Schema

#### 1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nama_pengguna TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  kata_sandi TEXT NOT NULL,
  peran TEXT NOT NULL CHECK (peran IN ('SUPERADMIN', 'ADMIN', 'TERAPIS')),
  nama_lengkap TEXT NOT NULL,
  telepon TEXT,
  alamat TEXT,
  status_aktif BOOLEAN DEFAULT true,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Anak Table (Gabungan Pasien & Keluarga)
```sql
CREATE TABLE anak (
  id SERIAL PRIMARY KEY,
  nomor_anak TEXT NOT NULL UNIQUE,
  nomor_va TEXT UNIQUE,
  excel_row_number INTEGER,
  nama_lengkap TEXT NOT NULL,
  nama_panggilan TEXT,
  tanggal_lahir DATE,
  tempat_lahir TEXT,
  usia_sekarang INTEGER,
  usia_observasi INTEGER,
  tangan_dominan TEXT CHECK (tangan_dominan IN ('KANAN', 'KIRI')),
  alamat_rumah TEXT,
  tanggal_mulai_terapi DATE,
  tanggal_selesai_terapi DATE,
  durasi_terapi TEXT,
  status_anak TEXT DEFAULT 'AKTIF' CHECK (status_anak IN ('AKTIF', 'CUTI', 'LULUS', 'BERHENTI')),
  tanggal_mulai_cuti DATE,
  tanggal_selesai_cuti DATE,
  durasi_cuti TEXT,
  sumber_informasi TEXT,
  terapi_sebelumnya BOOLEAN DEFAULT false,
  keluhan_awal TEXT,
  detail_keluhan_1 TEXT,
  detail_keluhan_2 TEXT,
  detail_keluhan_3 TEXT,
  detail_keluhan_4 TEXT,
  diagnosis_awal TEXT,
  dokumen_biodata_url TEXT,
  dokumen_inform_concern_url TEXT,
  video_observasi_url TEXT,
  file_observasi_url TEXT,
  tanggal_observasi DATE,
  
  -- Data keluarga (digabung dalam tabel yang sama)
  nama_ayah TEXT,
  pekerjaan_ayah TEXT,
  telepon_ayah TEXT,
  nama_ibu TEXT,
  pekerjaan_ibu TEXT,
  telepon_ibu TEXT,
  alamat_keluarga TEXT,
  
  -- Audit fields
  dibuat_oleh INTEGER,
  diperbarui_oleh INTEGER,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dihapus_pada TIMESTAMP,
  dihapus_oleh INTEGER,
  
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id),
  FOREIGN KEY (diperbarui_oleh) REFERENCES users(id),
  FOREIGN KEY (dihapus_oleh) REFERENCES users(id)
);
```

#### 3. Penilaian Anak Table
```sql
CREATE TABLE penilaian_anak (
  id SERIAL PRIMARY KEY,
  id_anak INTEGER NOT NULL,
  tanggal_penilaian DATE NOT NULL,
  jenis_penilaian TEXT NOT NULL,
  hasil_penilaian TEXT,
  catatan TEXT,
  dibuat_oleh INTEGER,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_anak) REFERENCES anak(id) ON DELETE CASCADE,
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id)
);
```

#### 4. Program Terapi Table
```sql
CREATE TABLE program_terapi (
  id SERIAL PRIMARY KEY,
  id_anak INTEGER NOT NULL,
  nama_program TEXT NOT NULL,
  deskripsi TEXT,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  status TEXT DEFAULT 'AKTIF' CHECK (status IN ('AKTIF', 'SELESAI', 'DIBATALKAN')),
  dibuat_oleh INTEGER,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_anak) REFERENCES anak(id) ON DELETE CASCADE,
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id)
);
```

#### 5. Kursus Table
```sql
CREATE TABLE kursus (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  durasi INTEGER,
  level TEXT CHECK (level IN ('PEMULA', 'MENENGAH', 'LANJUTAN')),
  kategori TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  status_aktif BOOLEAN DEFAULT true,
  dibuat_oleh INTEGER,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id)
);
```

#### 6. Ebook Table
```sql
CREATE TABLE ebook (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  penulis TEXT,
  deskripsi TEXT,
  kategori TEXT,
  file_url TEXT,
  cover_url TEXT,
  jumlah_halaman INTEGER,
  status_aktif BOOLEAN DEFAULT true,
  dibuat_oleh INTEGER,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id)
);
```

## 🌐 API Endpoints Lengkap

### Base URL: `http://localhost:3000/api`

### 🔐 Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "nama_pengguna": "johndoe",
  "email": "john@example.com",
  "kata_sandi": "password123",
  "peran": "TERAPIS",
  "nama_lengkap": "John Doe",
  "telepon": "08123456789",
  "alamat": "Jl. Contoh No. 123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@yametbatamtiban.com",
  "kata_sandi": "Superadminyamet"
}
```

### 👶 Anak Management Routes (`/api/anak`)

#### Get All Anak (Protected)
```http
GET /api/anak?page=1&limit=10&search=john&status=AKTIF&startDate=2024-01-01&endDate=2024-12-31&ageMin=5&ageMax=15&dominantHand=KANAN&sortBy=created_at&sortOrder=DESC
Authorization: Bearer <token>
```

#### Get Anak by ID (Protected)
```http
GET /api/anak/:id
Authorization: Bearer <token>
```

#### Create New Anak (Protected)
```http
POST /api/anak
Authorization: Bearer <token>
Content-Type: application/json

{
  "nomor_va": "2053-4040-9000-0001",
  "nama_lengkap": "Siti Nurhaliza",
  "nama_panggilan": "Siti",
  "tanggal_lahir": "2016-05-15",
  "tempat_lahir": "Bandung",
  "usia_sekarang": 8,
  "usia_observasi": 7,
  "tangan_dominan": "KANAN",
  "alamat_rumah": "Jl. Merdeka No. 45, Bandung",
  "tanggal_mulai_terapi": "2024-01-15",
  "status_anak": "AKTIF",
  "sumber_informasi": "Facebook",
  "keluhan_awal": "Kesulitan dalam motorik halus",
  "diagnosis_awal": "Developmental Coordination Disorder",
  "nama_ayah": "Budi Prasetyo",
  "pekerjaan_ayah": "Insinyur",
  "telepon_ayah": "08123456789",
  "nama_ibu": "Dewi Sartika",
  "pekerjaan_ibu": "Dokter",
  "telepon_ibu": "08123456790",
  "alamat_keluarga": "Jl. Merdeka No. 45, Bandung"
}
```

#### Update Anak (Protected)
```http
PUT /api/anak/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama_lengkap": "Siti Nurhaliza Updated",
  "status_anak": "CUTI",
  "tanggal_mulai_cuti": "2024-06-01",
  "tanggal_selesai_cuti": "2024-06-30"
}
```

#### Delete Anak (Protected - Soft Delete)
```http
DELETE /api/anak/:id
Authorization: Bearer <token>
```

### 📊 Dashboard Routes (`/api/dashboard`)

#### Get Overall Statistics (Protected)
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

## 🛠️ Fitur & CRUD Operations

### 1. User Management (CRUD)
- User registration with role assignment
- Password hashing with bcrypt
- Email/username uniqueness validation
- Status: pending approval (inactive by default)
- Role-based access control

### 2. Anak Management (CRUD)
- Automatic anak number generation (YAMET-YYYY-XXXX)
- Family data integration (digabung dalam satu tabel)
- Advanced filtering and search
- Pagination support
- Status-based filtering
- Age range filtering
- Date range filtering
- Sorting options
- Soft delete implementation

### 3. Dashboard & Statistics
- Real-time statistics
- User statistics by role
- Anak statistics by status
- Monthly registration trends
- Therapy program statistics
- Content statistics

## 📈 Dashboard & Statistik

### Real-time Statistics Response
```json
{
  "status": "success",
  "message": "Statistik dashboard berhasil diambil",
  "data": {
    "users": {
      "total": 25,
      "inactive": 5,
      "byRole": {
        "superadmin": 1,
        "admin": 3,
        "terapis": 21
      }
    },
    "anak": {
      "total": 150,
      "byStatus": {
        "aktif": 120,
        "cuti": 15,
        "lulus": 10,
        "berhenti": 5
      },
      "recent": 12,
      "byMonth": [
        {"month": "Jan", "count": 15},
        {"month": "Feb", "count": 18}
      ]
    },
    "therapy": {
      "total_programs": 85,
      "active_programs": 65,
      "byStatus": {
        "aktif": 65,
        "selesai": 15,
        "dibatalkan": 5
      }
    },
    "content": {
      "total_courses": 25,
      "total_ebooks": 30
    }
  }
}
```

## 🔒 Security & Middleware

### Authentication Middleware
- JWT token validation
- Role-based authorization
- Active user status check
- Input validation with Zod
- Error handling

### Security Features
- **Password Hashing:** Bcrypt (salt rounds: 10)
- **Token Expiration:** Configurable JWT expiry
- **Input Validation:** Zod schema validation
- **Type Safety:** Full TypeScript support

## 📋 Environment Configuration

### Required Environment Variables

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/yamet_db"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 Deployment Guide

### Development Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL configuration

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Production Deployment

#### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/yamet_production
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
CORS_ORIGIN=https://admin.yametbatamtiban.id,https://yametbatamtiban.id
NEXT_PUBLIC_API_URL=https://api.yametbatamtiban.id
PORT=3000
```

#### Build & Deploy
```bash
# Install dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Start production server
npm start
```

#### Health Check
```bash
curl https://api.yametbatamtiban.id/api/health
```

### Standard Production Deployment
```bash
# Build application
npm run build

# Start production server
npm start
```

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

---

## 🎯 Perubahan Utama dari Dokumentasi Sebelumnya

### ✅ Yang Sudah Diperbaiki:

1. **Teknologi Stack**: 
   - ✅ Express.js → Next.js App Router
   - ✅ SQLite → PostgreSQL
   - ✅ Manual SQL → Prisma ORM

2. **Struktur Database**:
   - ✅ Tabel `pasien` dan `keluarga_pasien` digabung menjadi satu tabel `anak`
   - ✅ Penamaan "pasien" diganti menjadi "anak"
   - ✅ Data keluarga disimpan dalam kolom yang sama dengan data anak

3. **API Structure**:
   - ✅ Menggunakan Next.js App Router (`app/api/`)
   - ✅ TypeScript support
   - ✅ Zod validation
   - ✅ Proper error handling

4. **Authentication**:
   - ✅ JWT token system
   - ✅ Role-based authorization
   - ✅ Middleware protection

5. **Database Operations**:
   - ✅ Prisma client generation
   - ✅ Database seeding
   - ✅ Migration support

### 🔄 Yang Perlu Dilakukan Selanjutnya:

1. **Setup Database PostgreSQL**
2. **Konfigurasi Environment Variables**
3. **Testing API Endpoints**
4. **Frontend Integration**

---

**🎉 Backend YAMET siap untuk integrasi dengan frontend!**

Sistem ini dirancang dengan arsitektur backend-heavy dimana semua proses data, statistik, dan business logic ditangani di backend. Frontend hanya perlu fokus pada UI/UX dan menampilkan data yang sudah diproses oleh backend.
#   a p i _ y a m e t _ b a t a m _ t i b a n 
 
 