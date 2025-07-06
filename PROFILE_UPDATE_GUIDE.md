# Profile Update Guide

## Overview
Ada **dua endpoint update** yang berbeda untuk keperluan yang berbeda. Pastikan menggunakan endpoint yang tepat!

## Endpoint 1: Update Profile Sendiri
**PUT** `/api/auth/update`

### Tujuan
Update profil user yang sedang login (sendiri)

### Parameter yang Diterima
```json
{
  "name": "Nama Baru",           // optional, min 2 max 100 karakter
  "email": "email@baru.com",     // optional, email valid (BARU!)
  "phone": "08123456789",        // optional
  "password": "passwordbaru"     // optional, min 6 karakter
}
```

### Contoh Request
```javascript
const response = await fetch('https://api.yametbatamtiban.id/api/auth/update', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nama Baru',
    email: 'email@baru.com',  // Sekarang bisa update email!
    phone: '08123456789',
    password: 'passwordbaru'
  })
});
```

### Response
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "user": {
      "id": 1,
      "name": "Nama Baru",
      "email": "email@baru.com",
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

### Fitur Baru: Update Email
✅ **User sekarang bisa update email mereka sendiri**
- Validasi email format
- Cek uniqueness (tidak boleh sama dengan user lain)
- Error message jika email sudah digunakan

---

## Endpoint 2: Update User Lain (Admin/Superadmin)
**PUT** `/api/auth/update-user`

### Tujuan
Update data user lain (hanya untuk ADMIN dan SUPERADMIN)

### Parameter yang Diterima
```json
{
  "userId": 123,                 // required, ID user yang akan diupdate
  "name": "Nama Baru",           // optional, min 2 max 100 karakter
  "email": "email@baru.com",     // optional, email valid
  "phone": "08123456789",        // optional
  "password": "passwordbaru",    // optional, min 6 karakter
  "role": "ADMIN",               // optional, ADMIN/MANAJER/TERAPIS/ORANGTUA
  "status": "active"             // optional, active/inactive/pending
}
```

### Contoh Request
```javascript
const response = await fetch('https://api.yametbatamtiban.id/api/auth/update-user', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 123,
    name: 'Nama Baru',
    email: 'email@baru.com',
    phone: '08123456789',
    password: 'passwordbaru',
    role: 'ADMIN',
    status: 'active'
  })
});
```

### Response
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "user": {
      "id": 123,
      "name": "Nama Baru",
      "email": "email@baru.com",
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

---

## Perbedaan Utama

| Aspek | `/api/auth/update` | `/api/auth/update-user` |
|-------|-------------------|-------------------------|
| **Tujuan** | Update profil sendiri | Update user lain |
| **Permission** | Semua user | ADMIN/SUPERADMIN only |
| **userId** | Tidak perlu (otomatis) | Required |
| **email** | ✅ Bisa update (BARU!) | ✅ Bisa update |
| **role** | Tidak bisa update | Bisa update (SUPERADMIN) |
| **status** | Tidak bisa update | Bisa update |

---

## Troubleshooting

### Masalah: "Tidak terjadi apa-apa saat update"

**Kemungkinan Penyebab:**
1. **Salah endpoint** - Menggunakan `/update-user` untuk update diri sendiri
2. **Parameter salah** - Tidak mengirim parameter yang benar
3. **CORS error** - Endpoint belum diperbaiki CORS-nya

**Solusi:**
1. **Untuk update profil sendiri**: Gunakan `/api/auth/update`
2. **Untuk update user lain**: Gunakan `/api/auth/update-user`
3. **Pastikan parameter benar** sesuai dokumentasi di atas
4. **Check browser console** untuk error CORS

### Error: "Email sudah digunakan oleh user lain"
- Email yang diinput sudah terdaftar oleh user lain
- Ganti dengan email yang belum terdaftar

### Error: "Data tidak valid"
- Format email tidak valid
- Password kurang dari 6 karakter
- Nama kurang dari 2 karakter

### Contoh Debug

```javascript
// Debug request
console.log('Request body:', {
  name: 'Nama Baru',
  email: 'email@baru.com',
  phone: '08123456789'
});

const response = await fetch('https://api.yametbatamtiban.id/api/auth/update', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nama Baru',
    email: 'email@baru.com',
    phone: '08123456789'
  })
});

// Debug response
console.log('Response status:', response.status);
const data = await response.json();
console.log('Response data:', data);
```

---

## CORS Status

✅ **Sudah Diperbaiki:**
- `/api/auth/update` - CORS dengan parameter `request`
- `/api/auth/update-user` - CORS dengan parameter `request`

✅ **Semua response** menggunakan `createCorsResponse(data, status, request)`
✅ **OPTIONS request** menggunakan `createCorsOptionsResponse(request)`

---

## Testing

### Test Update Profile Sendiri (dengan email)
```bash
curl -X PUT https://api.yametbatamtiban.id/api/auth/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama Baru",
    "email": "email@baru.com",
    "phone": "08123456789"
  }'
```

### Test Update User Lain
```bash
curl -X PUT https://api.yametbatamtiban.id/api/auth/update-user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "name": "Nama Baru",
    "email": "email@baru.com",
    "status": "active"
  }'
```

---

## Changelog

### Update Terbaru:
- ✅ **User bisa update email mereka sendiri** di `/api/auth/update`
- ✅ **CORS diperbaiki** untuk semua endpoint update
- ✅ **Validasi email uniqueness** untuk kedua endpoint
- ✅ **Error handling** yang lebih baik 