# User Management API Documentation

## Overview
API untuk mengelola data user dalam sistem YAMET. Semua endpoint memerlukan autentikasi dan menggunakan CORS yang sudah dikonfigurasi dengan benar.

## Base URL
```
https://api.yametbatamtiban.id/api/auth
```

## Authentication
Semua endpoint memerlukan header Authorization dengan format:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Users
**GET** `/users`

Mendapatkan daftar semua user dengan pagination dan filtering.

**Permissions:** SUPERADMIN only

**Query Parameters:**
- `page` (optional): Halaman yang diminta (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan nama, email
- `sortBy` (optional): Field untuk sorting (default: created_at)
- `sortOrder` (optional): ASC atau DESC (default: DESC)

**Response:**
```json
{
  "status": "success",
  "message": "Data user berhasil diambil",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "08123456789",
        "peran": "ADMIN",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "created_by": null,
        "role_id": 1,
        "creator": null
      }
    ],
    "statistics": {
      "totalAdmin": 5,
      "totalTerapis": 10,
      "totalOrangTua": 50
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 65,
      "totalPages": 7
    }
  }
}
```

### 2. Get User by ID
**GET** `/users/{id}`

Mendapatkan data user berdasarkan ID.

**Permissions:** SUPERADMIN atau user yang bersangkutan

**Response:**
```json
{
  "status": "success",
  "message": "Data user berhasil diambil",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "peran": "ADMIN",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "created_by": null,
      "role_id": 1,
      "creator": null
    }
  }
}
```

### 3. Get Users by Role
**GET** `/users/by-role`

Mendapatkan daftar user berdasarkan role tertentu.

**Permissions:** SUPERADMIN only

**Query Parameters:**
- `role` (required): Role yang dicari (ADMIN, TERAPIS, ORANGTUA)
- `page` (optional): Halaman yang diminta (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan nama, email
- `sortBy` (optional): Field untuk sorting (default: created_at)
- `sortOrder` (optional): ASC atau DESC (default: DESC)

**Response:**
```json
{
  "status": "success",
  "message": "Data user berhasil diambil",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1
    },
    "filters": {
      "role": "ADMIN",
      "search": ""
    }
  }
}
```

### 4. Get User Statistics
**GET** `/users/stats`

Mendapatkan statistik user untuk dashboard.

**Permissions:** SUPERADMIN only

**Response:**
```json
{
  "status": "success",
  "message": "Statistik user berhasil diambil",
  "data": {
    "overview": {
      "totalUsers": 65,
      "activeUsers": 60,
      "inactiveUsers": 3,
      "pendingUsers": 2
    },
    "byRole": {
      "admin": 5,
      "terapis": 10,
      "orangTua": 50
    },
    "growth": {
      "thisMonth": 5,
      "lastMonth": 3,
      "growthPercentage": 66.67
    },
    "percentages": {
      "activePercentage": 92,
      "inactivePercentage": 5,
      "pendingPercentage": 3
    }
  }
}
```

### 5. Update User Profile
**PUT** `/update`

Update data profil user yang sedang login.

**Permissions:** User yang bersangkutan

**Request Body:**
```json
{
  "name": "New Name",
  "phone": "08123456789",
  "password": "newpassword"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "user": {
      "id": 1,
      "name": "New Name",
      "email": "john@example.com",
      "phone": "08123456789",
      "peran": "ADMIN",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "created_by": null,
      "role_id": 1,
      "creator": null
    }
  }
}
```

### 6. Create Admin User
**POST** `/create-admin`

Membuat user admin baru.

**Permissions:** SUPERADMIN only

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "phone": "08123456789",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Admin berhasil dibuat",
  "data": {
    "user": {
      "id": 2,
      "name": "Admin Name",
      "email": "admin@example.com",
      "phone": "08123456789",
      "peran": "ADMIN",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "created_by": 1,
      "role_id": 2,
      "creator": {
        "id": 1,
        "name": "Super Admin",
        "role": { "name": "SUPERADMIN" }
      }
    }
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Akses ditolak. Token tidak valid."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Akses hanya untuk superadmin."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "User tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Terjadi kesalahan server"
}
```

## CORS Configuration

Semua endpoint menggunakan CORS yang dikonfigurasi secara dinamis berdasarkan origin request. Pastikan environment variable `CORS_ORIGIN` sudah diset dengan benar di production.

## Usage Examples

### Frontend JavaScript
```javascript
// Get all users
const response = await fetch('https://api.yametbatamtiban.id/api/auth/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get user by ID
const userResponse = await fetch('https://api.yametbatamtiban.id/api/auth/users/1', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get users by role
const adminUsers = await fetch('https://api.yametbatamtiban.id/api/auth/users/by-role?role=ADMIN', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get user statistics
const stats = await fetch('https://api.yametbatamtiban.id/api/auth/users/stats', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Notes

1. Semua endpoint sudah menggunakan CORS yang benar dengan parameter `request`
2. Pagination menggunakan zero-based indexing
3. Search bersifat case-insensitive
4. Password akan di-hash menggunakan bcrypt sebelum disimpan
5. Timestamps menggunakan format ISO 8601
6. Role names: SUPERADMIN, ADMIN, TERAPIS, ORANGTUA
7. Status values: active, inactive, pending 