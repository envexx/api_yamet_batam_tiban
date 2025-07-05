# API Documentation

## Dashboard Overview

### Endpoint
`GET /api/dashboard/stats`

### Description
Mengambil statistik dashboard untuk superadmin dan admin, termasuk total anak, total admin, total terapis, dan insight pertumbuhan anak berdasarkan tanggal_pemeriksaan. Insight pertumbuhan dapat difilter per bulan, kuartal, atau tahun.

### Query Parameters
| Name   | Type   | Description                                 | Default |
|--------|--------|---------------------------------------------|---------|
| period | string | Filter insight pertumbuhan anak:            | month   |
|        |        | - `month`: 6 bulan terakhir                |         |
|        |        | - `quarter`: 4 kuartal terakhir            |         |
|        |        | - `year`: 3 tahun terakhir                 |         |

### Authorization
- **Required**: Bearer token (JWT)
- Role: SUPERADMIN, ADMIN

### Response
```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
  "data": {
    // Untuk SUPERADMIN
    "total_anak": 120,
    "total_admin": 5,
    "total_terapis": 20,
    "total_superadmin": 1,
    "growth": [
      { "period": "Jan 24", "count": 10 },
      { "period": "Feb 24", "count": 12 },
      { "period": "Mar 24", "count": 15 },
      { "period": "Apr 24", "count": 18 },
      { "period": "May 24", "count": 20 },
      { "period": "Jun 24", "count": 22 }
    ]
    // Untuk ADMIN
    // "total_anak", "total_terapis", "growth" saja
  }
}
```

### Example (Frontend Fetch)
```js
fetch('/api/dashboard/stats?period=month', {
  headers: { Authorization: 'Bearer <token>' }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Notes
- Field `growth` berisi array insight pertumbuhan anak berdasarkan tanggal_pemeriksaan, sesuai periode yang dipilih.
- Untuk role ADMIN, hanya field `total_anak`, `total_terapis`, dan `growth` yang dikembalikan.
- Untuk role SUPERADMIN, semua field dikembalikan.

## Anak CRUD

### List Anak
`GET /api/anak`

#### Query Parameters
| Name        | Type   | Description                        |
|-------------|--------|------------------------------------|
| page        | int    | Page number (default: 1)           |
| limit       | int    | Items per page (default: 10)       |
| search      | string | Search by name, nickname, etc      |
| status      | string | Filter by status                   |
| startDate   | string | Filter created_at >= (ISO date)    |
| endDate     | string | Filter created_at <= (ISO date)    |
| ageMin      | int    | Filter current_age >=              |
| ageMax      | int    | Filter current_age <=              |
| dominantHand| string | Filter dominant_hand (KANAN/KIRI)  |
| sortBy      | string | Sort field (default: created_at)   |
| sortOrder   | string | asc/desc (default: desc)           |

#### Response
```json
{
  "status": "success",
  "message": "Data anak berhasil diambil",
  "data": [
    {
      "id": 1,
      "nomor_anak": "YAMET-2024-0001",
      "full_name": "Budi",
      "nick_name": "Budi",
      ...
      "user_created": { "id": 2, "full_name": "Admin" },
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Detail Anak
`GET /api/anak/{id}`

#### Response
```json
{
  "status": "success",
  "message": "Data anak berhasil diambil",
  "data": {
    "anak": {
      "id": 1,
      "nomor_anak": "YAMET-2024-0001",
      "full_name": "Budi",
      ...,
      "user_created": { "id": 2, "full_name": "Admin" },
      "user_updated": { "id": 2, "full_name": "Admin" },
      "penilaian": [ ... ],
      "program_terapi": [ ... ]
    }
  }
}
```

### Create Anak
`POST /api/anak`

#### Body (JSON)
```json
{
  "full_name": "Budi",
  "nick_name": "Budi",
  "birth_date": "2020-01-01",
  ...
}
```
#### Response
```json
{
  "status": "success",
  "message": "Data anak berhasil dibuat",
  "data": {
    "anak": {
      "id": 1,
      "nomor_anak": "YAMET-2024-0001",
      "full_name": "Budi",
      "nick_name": "Budi",
      "birth_date": "2020-01-01",
      "status": "AKTIF",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "updated_at": "2024-06-01T00:00:00.000Z",
      "user_created": { "id": 2, "full_name": "Admin" }
      // ...field lain sesuai schema
    }
  }
}
```

### Update Anak
`PUT /api/anak/{id}`

#### Body (JSON)
```json
{
  "full_name": "Budi Update",
  ...
}
```
#### Response
```json
{
  "status": "success",
  "message": "Data anak berhasil diperbarui",
  "data": {
    "anak": {
      "id": 1,
      "nomor_anak": "YAMET-2024-0001",
      "full_name": "Budi Update",
      "nick_name": "Budi",
      "birth_date": "2020-01-01",
      "status": "AKTIF",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "updated_at": "2024-06-10T00:00:00.000Z",
      "user_created": { "id": 2, "full_name": "Admin" },
      "user_updated": { "id": 2, "full_name": "Admin" }
    }
  }
}
```

### Delete Anak (Soft Delete)
`DELETE /api/anak/{id}`

#### Response
```json
{
  "status": "success",
  "message": "Data anak berhasil dihapus"
}
```

### Notes
- Semua endpoint membutuhkan Bearer token (JWT).
- Field dan response sudah konsisten dengan schema baru (bahasa Inggris).
- Soft delete hanya mengisi `deleted_at` dan `deleted_by`, data tidak benar-benar dihapus dari database.

## Assessment (Penilaian Anak) CRUD

### List Assessment Anak
`GET /api/anak/{id}/assessment`

#### Query Parameters
| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| page     | int    | Page number (default: 1)           |
| limit    | int    | Items per page (default: 10)       |
| sortBy   | string | Sort field (default: assessment_date) |
| sortOrder| string | asc/desc (default: desc)           |

#### Response
```json
{
  "status": "success",
  "message": "Assessment list fetched",
  "data": [
    {
      "id": 1,
      "anak_id": 1,
      "assessment_date": "2024-06-01T00:00:00.000Z",
      "assessment_type": "Kognitif",
      "assessment_result": "Baik",
      "notes": "Catatan...",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "user_created": { "id": 2, "full_name": "Admin" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Create Assessment Anak
`POST /api/anak/{id}/assessment`

#### Body (JSON)
```json
{
  "assessment_date": "2024-06-01",
  "assessment_type": "Kognitif",
  "assessment_result": "Baik",
  "notes": "Catatan..."
}
```
#### Response
```json
{
  "status": "success",
  "message": "Assessment created",
  "data": { "assessment": { ... } }
}
```

### Update Assessment Anak
`PUT /api/anak/{id}/assessment?assessmentId={assessmentId}`

#### Body (JSON)
```json
{
  "assessment_date": "2024-06-01",
  "assessment_type": "Kognitif",
  "assessment_result": "Baik",
  "notes": "Catatan update"
}
```
#### Response
```json
{
  "status": "success",
  "message": "Assessment updated",
  "data": { "assessment": { ... } }
}
```

### Delete Assessment Anak
`DELETE /api/anak/{id}/assessment?assessmentId={assessmentId}`

#### Response
```json
{
  "status": "success",
  "message": "Assessment deleted"
}
```

### Notes
- Untuk update dan delete assessment, parameter `assessmentId` wajib di query string.
- Hanya ADMIN & SUPERADMIN yang bisa update/delete assessment.

### Notes Tambahan
- Untuk update dan delete assessment, parameter `assessmentId` wajib di query string.
- Hanya ADMIN & SUPERADMIN yang bisa update/delete assessment.

## Program Terapi Anak CRUD

### List Program Terapi Anak
`GET /api/anak/{id}/program-terapi`

#### Query Parameters
| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| page     | int    | Page number (default: 1)           |
| limit    | int    | Items per page (default: 10)       |
| sortBy   | string | Sort field (default: created_at)   |
| sortOrder| string | asc/desc (default: desc)           |

#### Response
```json
{
  "status": "success",
  "message": "Program list fetched",
  "data": [
    {
      "id": 1,
      "anak_id": 1,
      "program_name": "Terapi Wicara",
      "description": "Deskripsi...",
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-07-01T00:00:00.000Z",
      "status": "AKTIF",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "user_created": { "id": 2, "full_name": "Admin" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Create Program Terapi Anak
`POST /api/anak/{id}/program-terapi`

#### Body (JSON)
```json
{
  "program_name": "Terapi Wicara",
  "description": "Deskripsi...",
  "start_date": "2024-06-01",
  "end_date": "2024-07-01",
  "status": "AKTIF"
}
```
#### Response
```json
{
  "status": "success",
  "message": "Program created",
  "data": { "program": { ... } }
}
```

### Update Program Terapi Anak
`PUT /api/anak/{id}/program-terapi?programId={programId}`

#### Body (JSON)
```json
{
  "program_name": "Terapi Wicara Update",
  "description": "Deskripsi update...",
  "start_date": "2024-06-10",
  "end_date": "2024-07-10",
  "status": "SELESAI"
}
```
#### Response
```json
{
  "status": "success",
  "message": "Program updated",
  "data": { "program": { ... } }
}
```

### Delete Program Terapi Anak
`DELETE /api/anak/{id}/program-terapi?programId={programId}`

#### Response
```json
{
  "status": "success",
  "message": "Program deleted"
}
```

### Notes
- Hanya ADMIN & SUPERADMIN yang bisa create/update/delete program terapi.
- Terapis hanya bisa melihat (GET/list).
- Semua endpoint membutuhkan Bearer token (JWT).
- Untuk update dan delete, parameter `programId` wajib di query string.
- Field dan response sudah konsisten dengan schema baru (bahasa Inggris).

## Import Excel Data Anak (Admin Only)

### Import Anak dari Excel
`POST /api/anak/import`

#### Deskripsi
Upload file Excel (.xlsx/.xls) berisi data anak. Hanya role ADMIN yang dapat mengakses endpoint ini.

#### Form Data
- **file**: File Excel yang akan diupload (type: file, required)

#### Format Kolom Excel yang Didukung
| Kolom Excel         | Keterangan (schema)      |
|---------------------|-------------------------|
| Nomor Anak          | nomor_anak (optional, unique) |
| Full Name           | full_name               |
| Nick Name           | nick_name               |
| Birth Date          | birth_date (YYYY-MM-DD) |
| Birth Place         | birth_place             |
| Current Age         | current_age             |
| Observation Age     | observation_age         |
| Dominant Hand       | dominant_hand (KANAN/KIRI) |
| Home Address        | home_address            |
| Therapy Start       | therapy_start (YYYY-MM-DD) |
| Therapy End         | therapy_end (YYYY-MM-DD) |
| Therapy Duration    | therapy_duration        |
| Status              | status (AKTIF/CUTI/LULUS/BERHENTI) |
| Info Source         | info_source             |
| Previous Therapy    | previous_therapy (true/false) |
| Initial Complaint   | initial_complaint       |
| Initial Diagnosis   | initial_diagnosis       |
| Father Name         | father_name             |
| Father Job          | father_job              |
| Father Phone        | father_phone            |
| Mother Name         | mother_name             |
| Mother Job          | mother_job              |
| Mother Phone        | mother_phone            |
| Family Address      | family_address          |

#### Response
```json
{
  "status": "success",
  "message": "Import selesai",
  "imported": 10,
  "failed": 2,
  "errors": [
    { "row": 5, "error": "Field full_name wajib diisi" }
  ]
}
```

#### Notes
- Hanya role ADMIN yang dapat mengakses endpoint ini.
- Jika kolom Nomor Anak sudah ada, maka data akan di-update. Jika tidak, akan dibuat baru.
- Kolom yang tidak ada di schema akan diabaikan.
- File harus dikirim sebagai form-data dengan key `file`.

## User Management

### Register User
`POST /api/auth/register`

#### Deskripsi
Registrasi user baru (ADMIN atau TERAPIS). Akun akan berstatus tidak aktif (is_active: false) dan harus diaktifkan oleh role yang berwenang.

#### Body (JSON)
```json
{
  "username": "adminbaru",
  "email": "adminbaru@yamet.com",
  "password": "passwordku",
  "role": "ADMIN", // atau "TERAPIS"
  "full_name": "Admin Baru",
  "phone": "08123456789",
  "address": "Alamat Admin"
}
```
#### Response
```json
{
  "status": "success",
  "message": "Registrasi berhasil. Akun menunggu persetujuan.",
  "data": {
    "user": {
      "id": 3,
      "username": "adminbaru",
      "email": "adminbaru@yamet.com",
      "role": "ADMIN",
      "full_name": "Admin Baru",
      "phone": "08123456789",
      "address": "Alamat Admin",
      "is_active": false,
      "created_at": "2024-06-01T00:00:00.000Z"
    }
  }
}
```
#### Notes
- Hanya role ADMIN dan TERAPIS yang bisa didaftarkan (bukan SUPERADMIN).
- Field password akan di-hash otomatis.
- Akun baru harus diaktifkan oleh role yang berwenang.

#### Contoh Error
```json
{
  "status": "error",
  "message": "Email atau username sudah terdaftar"
}
```

---

### Activate User
`POST /api/auth/activate`

#### Deskripsi
Aktivasi user oleh role yang berwenang. SUPERADMIN hanya bisa mengaktifkan ADMIN, ADMIN hanya bisa mengaktifkan TERAPIS.

#### Body (JSON)
```json
{
  "userId": 3
}
```
#### Response
```json
{
  "status": "success",
  "message": "User berhasil diaktifkan."
}
```
#### Notes
- Hanya SUPERADMIN yang bisa mengaktifkan ADMIN.
- Hanya ADMIN yang bisa mengaktifkan TERAPIS.
- Jika user sudah aktif, akan error.

#### Contoh Error
```json
{
  "status": "error",
  "message": "Hanya superadmin yang dapat mengaktifkan admin."
}
```

---

### Update User (Profile)
`PUT /api/auth/update`

#### Deskripsi
User dapat mengupdate data dirinya sendiri (nama, telepon, alamat, password). Jika password diisi, akan di-hash otomatis.

#### Body (JSON)
```json
{
  "full_name": "Nama Baru",
  "phone": "08123456789",
  "address": "Alamat Baru",
  "password": "passwordBaru123"
}
```
#### Response
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "user": {
      "id": 3,
      "username": "adminbaru",
      "email": "adminbaru@yamet.com",
      "role": "ADMIN",
      "full_name": "Nama Baru",
      "phone": "08123456789",
      "address": "Alamat Baru",
      "is_active": true,
      "created_at": "2024-06-01T00:00:00.000Z",
      "updated_at": "2024-06-10T00:00:00.000Z"
    }
  }
}
```
#### Notes
- Hanya user yang login bisa update dirinya sendiri.
- Jika password diisi, akan di-hash otomatis.
- Field lain yang tidak diisi tidak akan diubah.

#### Contoh Error
```json
{
  "status": "error",
  "message": "Data tidak valid",
  "errors": [
    { "path": ["full_name"], "message": "String must contain at least 2 character(s)" }
  ]
}
```

## Standar Response JSON CRUD

### Struktur Umum
```json
{
  "status": "success", // atau "error"
  "message": "Penjelasan singkat",
  "data": { ... }, // objek utama (anak, user, assessment, dsb)
  "pagination": { ... }, // jika applicable (list)
  "errors": [ ... ] // jika error validasi
}
```

### Contoh Response CRUD Anak

#### Create Anak
```json
{
  "status": "success",
  "message": "Data anak berhasil dibuat",
  "data": {
    "anak": {
      "id": 1,
      "nomor_anak": "YAMET-2024-0001",
      "full_name": "Budi",
      "nick_name": "Budi",
      "birth_date": "2020-01-01",
      "status": "AKTIF",
      "created_by": 2,
      "created_at": "2024-06-01T00:00:00.000Z",
      "updated_at": "2024-06-01T00:00:00.000Z",
      "user_created": { "id": 2, "full_name": "Admin" }
      // ...field lain sesuai schema
    }
  }
}
```

#### Update Anak
```json
{
  "status": "success",
  "message": "Data anak berhasil diperbarui",
  "data": {
    "anak": {
      // ...data anak terbaru, sama seperti create
    }
  }
}
```

#### List Anak
```json
{
  "status": "success",
  "message": "Data anak berhasil diambil",
  "data": [
    { /* anak 1 */ },
    { /* anak 2 */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Delete Anak
```json
{
  "status": "success",
  "message": "Data anak berhasil dihapus"
}
```

#### Error (Validasi/Unauthorized)
```json
{
  "status": "error",
  "message": "Data tidak valid",
  "errors": [
    { "path": ["full_name"], "message": "String must contain at least 2 character(s)" }
  ]
}
```

---

### Contoh Response CRUD Assessment & Program Terapi
- **Create/Update:**
```json
{
  "status": "success",
  "message": "Assessment created/updated",
  "data": { "assessment": { ... } }
}
```
```json
{
  "status": "success",
  "message": "Program created/updated",
  "data": { "program": { ... } }
}
```
- **List:**
```json
{
  "status": "success",
  "message": "Assessment list fetched",
  "data": [ { /* assessment 1 */ }, ... ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```
- **Delete:**
```json
{
  "status": "success",
  "message": "Assessment deleted"
}
```

---

### Contoh Response CRUD User
- **Register:**
```json
{
  "status": "success",
  "message": "Registrasi berhasil. Akun menunggu persetujuan.",
  "data": { "user": { ... } }
}
```
- **Activate:**
```json
{
  "status": "success",
  "message": "User berhasil diaktifkan."
}
```
- **Update:**
```json
{
  "status": "success",
  "message": "User berhasil diupdate",
  "data": { "user": { ... } }
}
```
- **Error:**
```json
{
  "status": "error",
  "message": "Email atau username sudah terdaftar"
}
```

---

### Catatan Penting
- **Selalu gunakan struktur response di atas untuk semua endpoint.**
- **Field data harus konsisten di semua response.**
- **Jika ada error validasi, sertakan array errors.**
- **Jika list, selalu sertakan pagination.**
- **Jangan hanya mengembalikan ID, selalu kembalikan objek data lengkap.**

## Lampiran Anak (Upload & Update File)

### Endpoint
`POST /api/anak/{id}/lampiran`

### Deskripsi
- Untuk upload, update, atau hapus file lampiran anak (hasil_eeg_url, hasil_bera_url, hasil_ct_scan_url, program_terapi_3bln_url, hasil_psikologis_psikiatris_url).
- Hanya field yang dikirim yang akan diubah. Field lain tetap.
- Jika upload ulang, file lama otomatis dihapus.
- Jika ingin hapus file, kirim field kosong/null.
- File akan disimpan di `/public/uploads/lampiran/` dan url file akan tercatat di database.

### Request
- **Method:** POST
- **Headers:**
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data
- **Body:**
  - Form-data, field sesuai nama di bawah:
    - hasil_eeg_url (file)
    - hasil_bera_url (file)
    - hasil_ct_scan_url (file)
    - program_terapi_3bln_url (file)
    - hasil_psikologis_psikiatris_url (file)

**Contoh upload satu file:**
```bash
curl -X POST http://localhost:3000/api/anak/1/lampiran \
  -H "Authorization: Bearer <token>" \
  -F "hasil_eeg_url=@/path/to/file.pdf"
```

**Contoh upload beberapa file sekaligus:**
```bash
curl -X POST http://localhost:3000/api/anak/1/lampiran \
  -H "Authorization: Bearer <token>" \
  -F "hasil_eeg_url=@/path/to/file1.pdf" \
  -F "hasil_bera_url=@/path/to/file2.pdf"
```

**Contoh hapus file (set null):**
- Kirim field kosong/null pada form-data:
```bash
curl -X POST http://localhost:3000/api/anak/1/lampiran \
  -H "Authorization: Bearer <token>" \
  -F "hasil_eeg_url="
```

### Response
```json
{
  "status": "success",
  "message": "Lampiran berhasil diupload",
  "data": {
    "id": 1,
    "anak_id": 1,
    "hasil_eeg_url": "/uploads/lampiran/12345-file.pdf",
    ...
  }
}
```

### Akses/Download File
- File dapat diakses melalui url yang dikembalikan, misal:
  - `http://localhost:3000/uploads/lampiran/12345-file.pdf`

### Catatan
- Hanya file yang dikirim yang akan diubah. Field lain tetap.
- Jika upload ulang, file lama otomatis dihapus.
- Jika ingin hapus file, kirim field kosong/null. 