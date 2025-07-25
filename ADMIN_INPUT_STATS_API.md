# API Statistik Inputan Admin

## 📊 Overview

API ini menyediakan statistik detail tentang jumlah inputan yang telah diselesaikan oleh setiap admin di sistem YAMET. Data ini dapat diakses oleh SUPERADMIN dan MANAJER untuk monitoring kinerja admin.

## 🔐 Authentication & Authorization

- **Method**: GET
- **Authentication**: Bearer Token (JWT)
- **Authorization**: SUPERADMIN, MANAJER
- **Endpoint**: `/api/dashboard/admin-stats`

## 📋 Parameter Query

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `all` | Periode waktu filter: `all`, `1month`, `4month`, `6month`, `1year` |

## 📊 Response Format

### Success Response (200)

```json
{
  "status": "success",
  "message": "Statistik inputan admin berhasil diambil",
  "data": {
    "period": "all",
    "filter_applied": "all_time",
    "summary": {
      "total_admin": 3,
      "total_input_from_all_admins": 150,
      "average_input_per_admin": 50.0,
      "top_performer": {
        "name": "Admin Utama",
        "total_input": 75
      },
      "lowest_performer": {
        "name": "Admin Baru",
        "total_input": 25
      }
    },
    "admin_details": [
      {
        "admin_id": 1,
        "admin_name": "Admin Utama",
        "admin_email": "admin@yamet.com",
        "admin_created_at": "2024-01-15T10:30:00Z",
        "total_input": 75,
        "detail": {
          "anak": 20,
          "penilaian": 15,
          "program_terapi": 10,
          "jadwal_terapi": 15,
          "sesi_terapi": 10,
          "ebook": 3,
          "kursus": 2
        }
      },
      {
        "admin_id": 2,
        "admin_name": "Admin Kedua",
        "admin_email": "admin2@yamet.com",
        "admin_created_at": "2024-02-01T09:00:00Z",
        "total_input": 50,
        "detail": {
          "anak": 15,
          "penilaian": 10,
          "program_terapi": 8,
          "jadwal_terapi": 12,
          "sesi_terapi": 5,
          "ebook": 0,
          "kursus": 0
        }
      }
    ],
    "breakdown_by_type": {
      "total_anak": 35,
      "total_penilaian": 25,
      "total_program_terapi": 18,
      "total_jadwal_terapi": 27,
      "total_sesi_terapi": 15,
      "total_ebook": 3,
      "total_kursus": 2
    }
  }
}
```

## 📈 Data yang Dihitung

### Jenis Inputan yang Dilacak

1. **Anak** - Data pasien yang dibuat
2. **Penilaian** - Assessment/penilaian anak
3. **Program Terapi** - Program terapi yang dibuat
4. **Jadwal Terapi** - Jadwal terapi yang dijadwalkan
5. **Sesi Terapi** - Sesi terapi yang dilaksanakan
6. **Ebook** - Konten ebook yang dibuat
7. **Kursus** - Konten kursus yang dibuat

### Metrik yang Disediakan

#### Summary
- **total_admin**: Jumlah admin aktif
- **total_input_from_all_admins**: Total inputan dari semua admin
- **average_input_per_admin**: Rata-rata inputan per admin
- **top_performer**: Admin dengan inputan terbanyak
- **lowest_performer**: Admin dengan inputan tersedikit

#### Detail per Admin
- **admin_id**: ID admin
- **admin_name**: Nama admin
- **admin_email**: Email admin
- **admin_created_at**: Tanggal admin dibuat
- **total_input**: Total inputan admin
- **detail**: Breakdown per jenis inputan

#### Breakdown by Type
- Total per jenis inputan dari semua admin

## 🔍 Contoh Penggunaan

### 1. Ambil semua data (tanpa filter waktu)
```bash
GET /api/dashboard/admin-stats
Authorization: Bearer <token>
```

### 2. Ambil data 1 bulan terakhir
```bash
GET /api/dashboard/admin-stats?period=1month
Authorization: Bearer <token>
```

### 3. Ambil data 4 bulan terakhir
```bash
GET /api/dashboard/admin-stats?period=4month
Authorization: Bearer <token>
```

### 4. Ambil data 1 tahun terakhir
```bash
GET /api/dashboard/admin-stats?period=1year
Authorization: Bearer <token>
```

## 🚨 Error Responses

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
  "message": "Akses ditolak. Hanya untuk superadmin dan manajer."
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Terjadi kesalahan server"
}
```

## 📊 Integrasi dengan Dashboard

Data ini juga tersedia di endpoint dashboard utama (`/api/dashboard/stats`) dalam field `admin_input_stats` untuk SUPERADMIN dan MANAJER.

## 🎯 Use Cases

1. **Performance Monitoring**: Melihat kinerja admin dalam input data
2. **Resource Allocation**: Mengetahui admin mana yang paling produktif
3. **Training Needs**: Mengidentifikasi admin yang perlu pelatihan tambahan
4. **Workload Distribution**: Memastikan distribusi beban kerja yang merata
5. **Quality Assurance**: Monitoring kualitas inputan per admin

## 🔧 Technical Notes

- Data diurutkan berdasarkan total input (descending)
- Hanya admin dengan status 'active' yang dihitung
- Filter waktu diterapkan pada field `created_at` untuk setiap jenis inputan
- Perhitungan dilakukan secara real-time dari database
- Response time dapat bervariasi tergantung jumlah admin dan data 