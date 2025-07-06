# User Management API Documentation

## Overview
Sistem manajemen user YAMET dengan role-based permissions yang memungkinkan superadmin dan admin untuk mengelola user dengan tingkat akses yang berbeda.

## Role Hierarchy

### Role Permissions
| Role | Can Create | Can Update | Can Activate | Can View |
|------|------------|------------|--------------|----------|
| **SUPERADMIN** | ADMIN, MANAJER, TERAPIS, ORANGTUA | All except other SUPERADMIN | All | All |
| **ADMIN** | TERAPIS, ORANGTUA | TERAPIS, ORANGTUA | TERAPIS, ORANGTUA | All |
| **MANAJER** | - | - | - | Limited |
| **TERAPIS** | - | - | - | Limited |
| **ORANGTUA** | - | - | - | Self only |

## API Endpoints

### 1. Create Admin (Superadmin Only)
**Endpoint:** `POST /api/auth/create-admin`

**Description:** Superadmin dapat membuat admin, manager, atau terapis baru.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@yametbatamtiban.com",
  "phone": "08123456789",
  "password": "password123",
  "role": "ADMIN"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "ADMIN berhasil dibuat oleh superadmin",
  "data": {
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "john@yametbatamtiban.com",
      "phone": "08123456789",
      "peran": "ADMIN",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z",
      "created_by": 1,
      "role_id": 3,
      "creator": {
        "id": 1,
        "name": "Super Administrator",
        "role": { "name": "SUPERADMIN" }
      }
    }
  }
}
```

**Error Responses:**
- `403`: Akses hanya untuk superadmin
- `400`: Data tidak valid atau email/phone sudah terdaftar
- `401`: Token tidak valid

### 2. Update User
**Endpoint:** `PUT /api/auth/update-user`

**Description:** Update informasi user dengan role-based permissions.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 5,
  "name": "John Doe Updated",
  "email": "john.updated@yametbatamtiban.com",
  "phone": "08123456788",
  "password": "newpassword123",
  "role": "MANAJER",
  "status": "active"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "user": {
      "id": 5,
      "name": "John Doe Updated",
      "email": "john.updated@yametbatamtiban.com",
      "phone": "08123456788",
      "peran": "MANAJER",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T11:00:00Z",
      "created_by": 1,
      "role_id": 2,
      "creator": {
        "id": 1,
        "name": "Super Administrator",
        "role": { "name": "SUPERADMIN" }
      }
    }
  }
}
```

**Error Responses:**
- `403`: Tidak memiliki izin untuk mengubah user
- `404`: User tidak ditemukan
- `400`: Data tidak valid atau email/phone sudah digunakan

### 3. Register User (Enhanced)
**Endpoint:** `POST /api/auth/register`

**Description:** Registrasi user dengan role-based permissions. Dapat digunakan untuk registrasi publik (ORANGTUA) atau oleh admin/superadmin.

**Public Registration (ORANGTUA only):**
```json
{
  "name": "Parent Name",
  "email": "parent@example.com",
  "phone": "08123456789",
  "password": "password123",
  "role": "ORANGTUA"
}
```

**Admin/Superadmin Registration:**
```json
{
  "name": "New Terapis",
  "email": "terapis@yametbatamtiban.com",
  "phone": "08123456790",
  "password": "password123",
  "role": "TERAPIS"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User berhasil dibuat",
  "data": {
    "user": {
      "id": 6,
      "name": "New Terapis",
      "email": "terapis@yametbatamtiban.com",
      "phone": "08123456790",
      "peran": "TERAPIS",
      "status": "active",
      "created_at": "2025-01-15T11:30:00Z",
      "updated_at": "2025-01-15T11:30:00Z",
      "created_by": 1,
      "role_id": 4,
      "creator": {
        "id": 1,
        "name": "Super Administrator",
        "role": { "name": "SUPERADMIN" }
      }
    }
  }
}
```

### 4. List Users (Superadmin Only)
**Endpoint:** `GET /api/auth/users`

**Description:** Mendapatkan daftar semua user dengan pagination dan filtering.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)
- `search`: Pencarian berdasarkan nama, email, atau full_name
- `sortBy`: Field untuk sorting (default: created_at)
- `sortOrder`: ASC atau DESC (default: DESC)

**Response (200):**
```json
{
  "status": "success",
  "message": "Data user berhasil diambil",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Super Administrator",
        "email": "superadmin@yametbatamtiban.com",
        "phone": "08123456789",
        "peran": "SUPERADMIN",
        "status": "active",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
        "created_by": null,
        "role_id": 1,
        "creator": null
      }
    ],
    "statistics": {
      "totalAdmin": 2,
      "totalTerapis": 5,
      "totalOrangTua": 10
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 18,
      "totalPages": 2
    }
  }
}
```

### 5. Activate User
**Endpoint:** `POST /api/auth/activate`

**Description:** Mengaktifkan user yang berstatus pending.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 5
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User berhasil diaktifkan."
}
```

### 6. Toggle User Status
**Endpoint:** `POST /api/auth/toggle-active`

**Description:** Mengubah status user antara active dan inactive.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 5,
  "is_active": true
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Status user berhasil diubah."
}
```

### 7. Update Profile (Self)
**Endpoint:** `PUT /api/auth/update`

**Description:** User mengupdate profilnya sendiri.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "08123456788",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "user": {
      "id": 5,
      "name": "Updated Name",
      "email": "john@yametbatamtiban.com",
      "phone": "08123456788",
      "peran": "ADMIN",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T12:00:00Z",
      "created_by": 1,
      "role_id": 3,
      "creator": {
        "id": 1,
        "name": "Super Administrator",
        "role": { "name": "SUPERADMIN" }
      }
    }
  }
}
```

## Permission Matrix

### Create User Permissions
| Actor Role | Can Create | Status | Notes |
|------------|------------|--------|-------|
| SUPERADMIN | ADMIN, MANAJER, TERAPIS, ORANGTUA | active | Cannot create SUPERADMIN |
| ADMIN | TERAPIS, ORANGTUA | active | Limited to lower roles |
| Public | ORANGTUA only | pending | Requires activation |

### Update User Permissions
| Actor Role | Can Update | Cannot Update | Notes |
|------------|------------|---------------|-------|
| SUPERADMIN | All except other SUPERADMIN | Other SUPERADMIN | Full access |
| ADMIN | TERAPIS, ORANGTUA | SUPERADMIN, ADMIN, MANAJER | Limited access |
| Others | Self only | Anyone else | Self-service only |

### Activation Permissions
| Actor Role | Can Activate | Notes |
|------------|--------------|-------|
| SUPERADMIN | ADMIN, MANAJER, TERAPIS, ORANGTUA | Full activation rights |
| ADMIN | TERAPIS, ORANGTUA | Limited activation rights |

## Security Features

### 1. Role-Based Access Control
- Setiap endpoint memvalidasi role user yang mengakses
- Permission matrix yang ketat untuk setiap operasi
- Audit trail dengan tracking `created_by`

### 2. Data Validation
- Zod schema validation untuk semua input
- Email dan phone uniqueness check
- Password hashing dengan bcrypt

### 3. Error Handling
- Comprehensive error messages
- Proper HTTP status codes
- Input validation errors

## Testing Examples

### Create Admin (Superadmin)
```bash
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@yametbatamtiban.com",
    "phone": "08123456791",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

### Update User (Superadmin)
```bash
curl -X PUT http://localhost:3000/api/auth/update-user \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 5,
    "name": "Updated Admin Name",
    "email": "updated@yametbatamtiban.com",
    "status": "active"
  }'
```

### List Users (Superadmin)
```bash
curl -X GET "http://localhost:3000/api/auth/users?page=1&limit=10&search=admin" \
  -H "Authorization: Bearer <superadmin_token>"
```

## Default Credentials

### Superadmin
- Email: `superadmin@yametbatamtiban.com`
- Password: `Superadminyamet`

### Admin
- Email: `admin@yametbatamtiban.com`
- Password: `Adminyamet123`

### Manager
- Email: `manager@yametbatamtiban.com`
- Password: `Manageryamet123`

### Terapis
- Email: `terapis@yametbatamtiban.com`
- Password: `Terapisyamet123`

## Maintenance Notes

### Database Schema
- User table dengan foreign key ke Role table
- Audit fields: `created_by`, `created_at`, `updated_at`
- Status field: `active`, `inactive`, `pending`

### Migration
- Role table dengan permissions JSON field
- User table dengan role_id foreign key
- Index pada email dan phone untuk uniqueness

### Future Enhancements
- Role permissions granular (JSON field)
- User activity logging
- Password reset functionality
- Email verification system
- Bulk user operations 