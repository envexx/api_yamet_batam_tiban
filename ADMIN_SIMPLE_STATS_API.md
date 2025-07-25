# API Statistik Sederhana Inputan Admin

## 📊 Overview

API ini menyediakan statistik sederhana tentang jumlah inputan yang telah diselesaikan oleh setiap admin di sistem YAMET. Data ini menampilkan hanya nama admin dan jumlah total inputan (tanpa breakdown detail).

## 🔐 Authentication & Authorization

- **Method**: GET
- **Authentication**: Bearer Token (JWT)
- **Authorization**: SUPERADMIN, MANAJER
- **Endpoint**: `/api/dashboard/admin-simple-stats`

## 📋 Parameter Query

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `all` | Periode waktu filter: `all`, `1month`, `4month`, `6month`, `1year` |

## 📊 Response Format

### Success Response (200)

```json
{
  "status": "success",
  "message": "Statistik sederhana inputan admin berhasil diambil",
  "data": {
    "period": "all",
    "filter_applied": "all_time",
    "total_admin": 3,
    "total_input_from_all_admins": 150,
    "admin_list": [
      {
        "admin_name": "Admin Utama",
        "total_input": 75
      },
      {
        "admin_name": "Admin Kedua",
        "total_input": 50
      },
      {
        "admin_name": "Admin Baru",
        "total_input": 25
      }
    ]
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

- **period**: Periode waktu yang dipilih
- **filter_applied**: Filter waktu yang diterapkan
- **total_admin**: Jumlah admin aktif
- **total_input_from_all_admins**: Total inputan dari semua admin
- **admin_list**: Daftar admin dengan nama dan total inputan

## 🔍 Contoh Penggunaan

### 1. Ambil semua data (tanpa filter waktu)
```bash
GET /api/dashboard/admin-simple-stats
Authorization: Bearer <token>
```

### 2. Ambil data 1 bulan terakhir
```bash
GET /api/dashboard/admin-simple-stats?period=1month
Authorization: Bearer <token>
```

### 3. Ambil data 4 bulan terakhir
```bash
GET /api/dashboard/admin-simple-stats?period=4month
Authorization: Bearer <token>
```

### 4. Ambil data 1 tahun terakhir
```bash
GET /api/dashboard/admin-simple-stats?period=1year
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

## 🎯 Use Cases

1. **Quick Overview**: Melihat ringkasan cepat kinerja admin
2. **Dashboard Widget**: Menampilkan data di widget dashboard
3. **Performance Comparison**: Membandingkan kinerja antar admin
4. **Simple Reporting**: Laporan sederhana untuk manajemen

## 🔧 Technical Notes

- Data diurutkan berdasarkan total input (descending)
- Hanya admin dengan status 'active' yang dihitung
- Filter waktu diterapkan pada field `created_at` untuk setiap jenis inputan
- Response lebih ringan dibanding endpoint detail
- Cocok untuk tampilan dashboard yang membutuhkan data cepat

## 📊 Perbandingan dengan Endpoint Detail

| Fitur | Simple Stats | Detail Stats |
|-------|--------------|--------------|
| Nama admin | ✅ | ✅ |
| Total input | ✅ | ✅ |
| Breakdown per jenis | ❌ | ✅ |
| Email admin | ❌ | ✅ |
| Tanggal dibuat admin | ❌ | ✅ |
| Top performer | ❌ | ✅ |
| Average input | ❌ | ✅ |
| Response size | Kecil | Besar |
| Loading time | Cepat | Lebih lambat |

## 🚀 Rekomendasi Penggunaan

- **Gunakan Simple Stats** untuk:
  - Widget dashboard
  - Quick overview
  - Mobile app
  - Real-time monitoring

- **Gunakan Detail Stats** untuk:
  - Laporan detail
  - Analisis mendalam
  - Performance review
  - Training assessment 