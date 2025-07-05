# Dokumentasi Update API - Backend Schema Changes

## 📋 Ringkasan Perubahan

Backend telah diupdate untuk mendukung schema database baru dengan perubahan utama:
- **Role System**: Dari enum menjadi relasi ke tabel `Role`
- **User Fields**: Penambahan field baru dan perubahan struktur
- **Lampiran**: Penambahan field `perjanjian`
- **Status System**: Perubahan logic status user dan anak

---

## 🔄 Perubahan Struktur Data

### 1. **User Model Changes**

#### Field yang Berubah:
```typescript
// SEBELUM
{
  id: number,
  username: string,
  full_name: string,
  email: string,
  role: "SUPERADMIN" | "ADMIN" | "TERAPIS",
  is_active: boolean,
  address: string,
  // ... field lain
}

// SESUDAH
{
  id: number,
  name: string,                    // Ganti dari full_name
  email: string | null,
  phone: string | null,            // Field baru
  role_id: number,                 // Relasi ke tabel Role
  role: {                          // Relasi object
    name: string
  },
  status: "active" | "inactive" | "pending",  // Ganti dari is_active
  created_by: number | null,       // Field baru
  creator: {                       // Relasi object (optional)
    id: number,
    name: string,
    role: { name: string }
  },
  // ... field lain
}
```

#### Response Format Baru:
```typescript
// Login Response
{
  status: "success",
  message: "Login berhasil",
  data: {
    token: string,
    user: {
      id: number,
      name: string,              // Ganti dari full_name
      email: string | null,
      phone: string | null,
      peran: string,             // Ganti dari role (ambil dari user.role.name)
      status: string,
      created_by: number | null,
      role_id: number,
      creator: object | null
    }
  }
}

// Users List Response
{
  status: "success",
  message: "Data users berhasil diambil",
  data: {
    users: Array<{
      id: number,
      name: string,              // Ganti dari full_name
      email: string | null,
      phone: string | null,
      peran: string,             // Ganti dari role
      status: string,            // Ganti dari is_active
      created_at: string,
      updated_at: string,
      created_by: number | null,
      role_id: number,
      creator: object | null
    }>,
    statistics: {
      totalAdmin: number,
      totalTerapis: number,
      totalOrangTua: number
    },
    pagination: object
  }
}
```

### 2. **Lampiran Model Changes**

#### Field Baru:
```typescript
// SEBELUM
{
  id: number,
  anak_id: number,
  hasil_eeg_url: string | null,
  hasil_bera_url: string | null,
  hasil_ct_scan_url: string | null,
  program_terapi_3bln_url: string | null,
  hasil_psikologis_psikiatris_url: string | null,
  keterangan_tambahan: string | null
}

// SESUDAH
{
  id: number,
  anak_id: number,
  hasil_eeg_url: string | null,
  hasil_bera_url: string | null,
  hasil_ct_scan_url: string | null,
  program_terapi_3bln_url: string | null,
  hasil_psikologis_psikiatris_url: string | null,
  perjanjian: string | null,           // FIELD BARU
  keterangan_tambahan: string | null
}
```

### 3. **Anak Model Changes**

#### User Created/Updated Relations:
```typescript
// SEBELUM
{
  user_created: {
    id: number,
    full_name: string
  }
}

// SESUDAH
{
  user_created: {
    id: number,
    name: string                    // Ganti dari full_name
  }
}
```

---

## 🔗 Endpoint Changes

### 1. **Authentication Endpoints**

#### `POST /api/auth/login`
- **Response**: Field `role` → `peran`, `full_name` → `name`
- **JWT Payload**: Sekarang berisi `peran`, `status`, `created_by`, `role_id`

#### `POST /api/auth/register`
- **Request**: Field `role` tetap sama (enum string)
- **Response**: Field `role` → `peran`, `full_name` → `name`
- **Status**: Default `pending` (bisa diubah sesuai role)

#### `GET /api/auth/profile`
- **Response**: Field `role` → `peran`, `full_name` → `name`

#### `PUT /api/auth/update`
- **Response**: Field `role` → `peran`, `full_name` → `name`

#### `GET /api/auth/users`
- **Response**: Field `role` → `peran`, `full_name` → `name`
- **Statistics**: Sekarang include `totalOrangTua`

#### `POST /api/auth/toggle-active`
- **Logic**: Pakai `status` bukan `is_active`
- **Role Check**: Pakai `user.role.name` bukan `user.role`

#### `POST /api/auth/activate`
- **Logic**: Pakai `status` bukan `is_active`
- **Role Check**: Pakai `user.role.name` bukan `user.role`

### 2. **Dashboard Endpoints**

#### `GET /api/dashboard/stats`
- **Response**: Sekarang include `totalManajer`, `totalOrangTua`
- **Role-based**: Response berbeda sesuai role user

### 3. **Anak Endpoints**

#### `GET /api/anak`
- **Include Relations**: `user_created` pakai field `name`
- **Lampiran**: Sekarang include field `perjanjian`

#### `GET /api/anak/[id]`
- **Include Relations**: `user_created`, `user_updated` pakai field `name`
- **Lampiran**: Sekarang include field `perjanjian`

#### `POST /api/anak`
- **Lampiran Schema**: Tambah field `perjanjian` (optional)
- **Include Relations**: `user_created` pakai field `name`

#### `PUT /api/anak/[id]`
- **Lampiran Schema**: Tambah field `perjanjian` (optional)
- **Include Relations**: `user_created`, `user_updated` pakai field `name`

#### `POST /api/anak/[id]/lampiran`
- **Supported Fields**: Tambah `perjanjian` ke daftar field yang bisa diupload

### 4. **Program Terapi & Assessment Endpoints**

#### `GET /api/program-terapi`
- **Include Relations**: `user_created` pakai field `name`

#### `GET /api/assessment`
- **Include Relations**: `user_created` pakai field `name`

#### `GET /api/anak/[id]/program-terapi`
- **Include Relations**: `user_created` pakai field `name`

#### `GET /api/anak/[id]/assessment`
- **Include Relations**: `user_created` pakai field `name`

---

## 📝 Frontend Migration Guide

### 1. **Update User Data Handling**

```typescript
// SEBELUM
const user = response.data.user;
console.log(user.full_name);  // ❌ Error
console.log(user.role);       // ❌ Error

// SESUDAH
const user = response.data.user;
console.log(user.name);       // ✅ Correct
console.log(user.peran);      // ✅ Correct
```

### 2. **Update JWT Token Handling**

```typescript
// SEBELUM
const token = jwt_decode(token);
const userRole = token.role;  // ❌ Error

// SESUDAH
const token = jwt_decode(token);
const userRole = token.peran; // ✅ Correct
```

### 3. **Update Lampiran Form**

```typescript
// SEBELUM
const lampiranData = {
  hasil_eeg_url: "...",
  hasil_bera_url: "...",
  // ... field lain
};

// SESUDAH
const lampiranData = {
  hasil_eeg_url: "...",
  hasil_bera_url: "...",
  perjanjian: "...",          // ✅ Tambah field ini
  // ... field lain
};
```

### 4. **Update Role-based Logic**

```typescript
// SEBELUM
if (user.role === 'ADMIN') {
  // logic
}

// SESUDAH
if (user.peran === 'ADMIN') {
  // logic
}
```

### 5. **Update Status Logic**

```typescript
// SEBELUM
if (user.is_active) {
  // logic
}

// SESUDAH
if (user.status === 'active') {
  // logic
}
```

---

## ⚠️ Breaking Changes

### 1. **Field Name Changes**
- `user.full_name` → `user.name`
- `user.role` → `user.peran`
- `user.is_active` → `user.status`

### 2. **Response Structure Changes**
- Semua response user sekarang include `created_by`, `role_id`, `creator`
- Dashboard stats include field baru (`totalManajer`, `totalOrangTua`)

### 3. **JWT Payload Changes**
- Field `role` → `peran`
- Tambah field `status`, `created_by`, `role_id`

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login dengan email/phone
- [ ] Register user baru
- [ ] Update profile
- [ ] Toggle user active/inactive
- [ ] Activate user

### Dashboard
- [ ] Load dashboard stats sesuai role
- [ ] Tampilkan data user dengan field baru

### Anak Management
- [ ] Create anak dengan lampiran (termasuk perjanjian)
- [ ] Update anak dengan lampiran
- [ ] Upload lampiran (termasuk perjanjian)
- [ ] View anak dengan relasi user yang benar

### Role-based Access
- [ ] SUPERADMIN bisa akses semua
- [ ] ADMIN bisa akses terapis & orangtua
- [ ] TERAPIS akses terbatas
- [ ] ORANGTUA akses terbatas

---

## 📞 Support

Jika ada pertanyaan atau masalah dengan migration, silakan hubungi backend team.

**Last Updated**: December 2024
**Version**: 2.0.0 