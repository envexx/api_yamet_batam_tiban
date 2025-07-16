# Marketing API Documentation

## Overview
API Marketing dirancang khusus untuk tim marketing YAMET Batam Tiban untuk menganalisis data pasien dan menghasilkan insight yang berguna untuk strategi marketing.

## Role Marketing
Role baru `MARKETING` telah ditambahkan ke sistem dengan akses khusus ke data analitik marketing.

### Credentials Default
```
Email: marketing@yametbatamtiban.com
Password: Marketingyamet123
```

## Endpoints

### 1. Main Marketing Dashboard
**GET** `/api/marketing`

Ringkasan utama data marketing dengan insight cepat dan rekomendasi.

#### Response
```json
{
  "status": "success",
  "message": "Data marketing berhasil diambil",
  "data": {
    "ringkasan": {
      "total_pasien": 150,
      "pasien_aktif": 120,
      "persentase_aktif": 80
    },
    "insight_cepat": {
      "keluhan_teratas": [
        { "keluhan": "Sulit bicara", "count": 45 },
        { "keluhan": "Sering tantrum", "count": 32 },
        { "keluhan": "Kurang konsentrasi", "count": 28 }
      ],
      "sumber_informasi_teratas": [
        { "sumber": "Internet", "count": 60 },
        { "sumber": "Sosial Media", "count": 35 },
        { "sumber": "Teman/Keluarga", "count": 25 }
      ]
    },
    "menu_tersedia": [
      {
        "nama": "Dashboard",
        "endpoint": "/api/marketing/dashboard",
        "deskripsi": "Ringkasan data pasien, keluhan terbanyak, data orang tua, pertumbuhan pasien",
        "fitur": ["Ringkasan Data Pasien", "Keluhan Terbanyak", "Data Orang Tua", "Pertumbuhan Pasien"]
      }
    ],
    "rekomendasi_marketing": {
      "konten_prioritas": ["Tips melatih kemampuan bicara anak", "Cara mengatasi tantrum anak"],
      "channel_marketing": ["SEO optimization", "Website content", "Instagram", "Facebook"],
      "target_audiens": ["Orang tua anak usia 2-5 tahun", "Orang tua anak usia 1-4 tahun"],
      "strategi_konten": ["Blog posts", "Video edukasi", "Short videos", "Infographics"]
    }
  }
}
```

### 2. Marketing Dashboard Detail
**GET** `/api/marketing/dashboard`

Analisis detail dashboard marketing dengan data lengkap.

#### Response
```json
{
  "status": "success",
  "message": "Data dashboard marketing berhasil diambil",
  "data": {
    "ringkasan_pasien": {
      "total": 150,
      "aktif": 120,
      "cuti": 20,
      "berhenti": 10
    },
    "keluhan_terbanyak": [
      { "keluhan": "Sulit bicara", "count": 45 },
      { "keluhan": "Sering tantrum", "count": 32 },
      { "keluhan": "Kurang konsentrasi", "count": 28 }
    ],
    "data_orang_tua": {
      "pendidikan": [
        { "pendidikan": "S1", "count": 80 },
        { "pendidikan": "SMA", "count": 45 },
        { "pendidikan": "S2", "count": 15 }
      ],
      "pekerjaan": [
        { "pekerjaan": "Karyawan", "count": 60 },
        { "pekerjaan": "Ibu Rumah Tangga", "count": 40 },
        { "pekerjaan": "Wiraswasta", "count": 25 }
      ]
    },
    "pertumbuhan_pasien": [
      { "bulan": "2024-01", "jumlah": 15 },
      { "bulan": "2024-02", "jumlah": 18 },
      { "bulan": "2024-03", "jumlah": 22 }
    ],
    "distribusi_usia": [
      { "rentang": "0-2 tahun", "jumlah": 25 },
      { "rentang": "3-5 tahun", "jumlah": 45 },
      { "rentang": "6-8 tahun", "jumlah": 35 },
      { "rentang": "9-12 tahun", "jumlah": 30 },
      { "rentang": "13+ tahun", "jumlah": 15 }
    ]
  }
}
```

### 3. Marketing Content Analysis
**GET** `/api/marketing/konten`

Analisis konten marketing berdasarkan data pasien.

#### Response
```json
{
  "status": "success",
  "message": "Data konten marketing berhasil diambil",
  "data": {
    "ide_konten": [
      {
        "keluhan": "Sulit bicara",
        "frekuensi": 45,
        "ide_konten": "Tips melatih kemampuan bicara anak usia dini",
        "target_audiens": "Orang tua anak usia 2-5 tahun"
      }
    ],
    "konten_sesuai_usia": [
      {
        "rentang_usia": "3-5 tahun",
        "jumlah_pasien": 45,
        "konten_rekomendasi": [
          "Latihan kemampuan bicara dan bahasa",
          "Aktivitas motorik untuk balita",
          "Persiapan masuk sekolah"
        ],
        "keluhan_umum": ["Sulit bicara", "Sering tantrum", "Kurang konsentrasi"]
      }
    ],
    "solusi_masalah": [
      {
        "kendala": "Biaya",
        "frekuensi": 30,
        "solusi": "Program terapi dengan biaya terjangkau dan cicilan",
        "tips_marketing": "Highlight value for money, program cicilan, dan asuransi"
      }
    ],
    "analisis_tindakan_orang_tua": [
      {
        "tindakan": "Sudah terapi",
        "frekuensi": 40,
        "insight_marketing": "Target untuk program lanjutan dan maintenance"
      }
    ]
  }
}
```

### 4. Target Audience Analysis
**GET** `/api/marketing/target-audiens`

Analisis target audiens berdasarkan profil pasien dan orang tua.

#### Response
```json
{
  "status": "success",
  "message": "Data target audiens marketing berhasil diambil",
  "data": {
    "profil_pasien": {
      "distribusi_usia": [
        { "rentang": "3-5 tahun", "jumlah": 45 },
        { "rentang": "6-8 tahun", "jumlah": 35 }
      ],
      "distribusi_gender": [
        { "gender": "LAKI_LAKI", "jumlah": 80 },
        { "gender": "PEREMPUAN", "jumlah": 70 }
      ],
      "distribusi_status": [
        { "status": "AKTIF", "jumlah": 120 },
        { "status": "CUTI", "jumlah": 20 },
        { "status": "BERHENTI", "jumlah": 10 }
      ],
      "keluhan_terbanyak": [
        { "keluhan": "Sulit bicara", "jumlah": 45 },
        { "keluhan": "Sering tantrum", "jumlah": 32 }
      ]
    },
    "tempat_tinggal": {
      "distribusi_lokasi": [
        { "kota": "Batam", "jumlah": 80 },
        { "kota": "Jakarta", "jumlah": 25 },
        { "kota": "Surabaya", "jumlah": 15 }
      ],
      "status_per_lokasi": [
        {
          "kota": "Batam",
          "aktif": 65,
          "cuti": 10,
          "berhenti": 5
        }
      ]
    },
    "pekerjaan_orang_tua": {
      "distribusi_pekerjaan": [
        { "pekerjaan": "Karyawan", "jumlah": 60 },
        { "pekerjaan": "Ibu Rumah Tangga", "jumlah": 40 }
      ],
      "distribusi_pendidikan": [
        { "pendidikan": "S1", "jumlah": 80 },
        { "pendidikan": "SMA", "jumlah": 45 }
      ],
      "status_per_pekerjaan": [
        {
          "pekerjaan": "Karyawan",
          "aktif": 50,
          "cuti": 8,
          "berhenti": 2
        }
      ]
    },
    "sumber_informasi": {
      "distribusi_sumber": [
        { "sumber": "Internet", "jumlah": 60 },
        { "sumber": "Sosial Media", "jumlah": 35 }
      ],
      "status_per_sumber": [
        {
          "sumber": "Internet",
          "aktif": 50,
          "cuti": 8,
          "berhenti": 2
        }
      ]
    },
    "segmentasi_target": {
      "Balita (3-5 tahun)": {
        "karakteristik": "Orang tua aktif mencari solusi masalah perkembangan",
        "konten_rekomendasi": [
          "Latihan bicara",
          "Aktivitas motorik",
          "Persiapan sekolah"
        ],
        "channel_marketing": ["Instagram", "TikTok", "WhatsApp"],
        "budget_estimasi": "Menengah",
        "jumlah_pasien": 45
      }
    }
  }
}
```

## Authentication
Semua endpoint marketing memerlukan authentication dengan role `MARKETING`.

### Headers Required
```
Authorization: Bearer <jwt_token>
```

## Error Responses

### Unauthorized (401)
```json
{
  "status": "error",
  "message": "Akses ditolak. Token tidak valid."
}
```

### Forbidden (403)
```json
{
  "status": "error",
  "message": "Akses ditolak. Hanya untuk marketing."
}
```

### Server Error (500)
```json
{
  "status": "error",
  "message": "Terjadi kesalahan server"
}
```

## Features

### 1. Dashboard Marketing
- **Ringkasan Data Pasien**: Total, aktif, cuti, berhenti
- **Keluhan Terbanyak**: Analisis keluhan berdasarkan frekuensi
- **Data Orang Tua**: Pendidikan dan pekerjaan
- **Pertumbuhan Pasien**: Trend per bulan
- **Distribusi Usia**: Analisis usia pasien

### 2. Konten Marketing
- **Ide Konten**: Berdasarkan keluhan terbanyak
- **Konten Sesuai Usia**: Rekomendasi konten per rentang usia
- **Solusi Masalah**: Berdasarkan kendala yang dihadapi
- **Analisis Tindakan**: Insight dari tindakan orang tua

### 3. Target Audiens
- **Profil Pasien**: Usia, gender, status, keluhan
- **Tempat Tinggal**: Distribusi lokasi dan status per lokasi
- **Pekerjaan Orang Tua**: Analisis pekerjaan dan pendidikan
- **Sumber Informasi**: Channel yang efektif
- **Segmentasi Target**: Karakteristik dan rekomendasi per segment

## Usage Examples

### Frontend Integration
```javascript
// Get main marketing data
const response = await fetch('/api/marketing', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();

// Get dashboard detail
const dashboardResponse = await fetch('/api/marketing/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const dashboardData = await dashboardResponse.json();

// Get content analysis
const contentResponse = await fetch('/api/marketing/konten', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const contentData = await contentResponse.json();

// Get target audience
const audienceResponse = await fetch('/api/marketing/target-audiens', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const audienceData = await audienceResponse.json();
```

## Security Notes
- Semua data yang dikembalikan adalah data agregat, bukan data individual yang sensitif
- Role `MARKETING` hanya memiliki akses read-only
- Tidak ada endpoint untuk create, update, atau delete data
- Data yang ditampilkan sudah difilter untuk keamanan

## Database Migration
Untuk menambahkan role Marketing, jalankan:
```bash
npx prisma db seed
```

Ini akan menambahkan role `MARKETING` dan user default marketing ke database. 