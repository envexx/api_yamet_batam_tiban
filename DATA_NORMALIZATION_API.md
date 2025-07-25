# API Normalisasi Data - Top Keluhan & Sumber Informasi

## 📊 Overview

API ini menyediakan sistem normalisasi data untuk menyederhanakan data Top Keluhan dan Sumber Informasi yang bisa berbeda-beda namun memiliki makna yang sama. Sistem ini membantu mengelompokkan data yang serupa untuk analisis yang lebih akurat.

## 🔧 Library Normalisasi

### File: `app/lib/data-normalizer.ts`

Library ini menyediakan fungsi-fungsi untuk:
- Normalisasi data keluhan
- Normalisasi data sumber informasi
- Format data untuk display
- Manajemen mapping

## 📋 Endpoint yang Tersedia

### 1. Statistik Normalisasi
```
GET /api/dashboard/normalized-stats
```

**Parameter Query:**
- `period` (string): `all`, `1month`, `4month`, `6month`, `1year`
- `maxItems` (number): Jumlah maksimal item yang ditampilkan (default: 5)

**Response:**
```json
{
  "status": "success",
  "message": "Statistik normalisasi berhasil diambil",
  "data": {
    "period": "all",
    "filter_applied": "all_time",
    "max_items": 5,
    "top_keluhan": {
      "raw_data": [
        { "keluhan": "sulit bicara", "count": 2 },
        { "keluhan": "terlambat bicara", "count": 3 }
      ],
      "normalized_data": [
        {
          "original": "sulit bicara, terlambat bicara",
          "normalized": "terlambat bicara",
          "count": 5
        }
      ],
      "formatted": "terlambat bicara\n5 kasus",
      "summary": {
        "total_unique_keluhan": 2,
        "total_normalized_keluhan": 1,
        "top_keluhan": {
          "normalized": "terlambat bicara",
          "count": 5
        }
      }
    },
    "sumber_informasi": {
      "raw_data": [
        { "sumber": "google", "count": 6 },
        { "googling", "count": 1 }
      ],
      "normalized_data": [
        {
          "original": "google, googling",
          "normalized": "internet",
          "count": 7
        }
      ],
      "formatted": "internet\n7 kasus",
      "summary": {
        "total_unique_sumber": 2,
        "total_normalized_sumber": 1,
        "top_sumber": {
          "normalized": "internet",
          "count": 7
        }
      }
    },
    "terapi_berhasil": {
      "jumlah_lulus": 10,
      "total_anak": 100,
      "persentase_berhasil": 10.0
    }
  }
}
```

### 2. Tambah Mapping Baru
```
POST /api/dashboard/normalized-stats/mapping
```

**Body:**
```json
{
  "type": "keluhan", // atau "sumber"
  "original": "sulit ngomong",
  "normalized": "terlambat bicara"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Mapping keluhan berhasil ditambahkan",
  "data": {
    "type": "keluhan",
    "original": "sulit ngomong",
    "normalized": "terlambat bicara"
  }
}
```

### 3. Lihat Semua Mapping
```
GET /api/dashboard/normalized-stats/mapping
```

**Response:**
```json
{
  "status": "success",
  "message": "Mapping berhasil diambil",
  "data": {
    "keluhan": {
      "sulit bicara": "terlambat bicara",
      "terlambat bicara": "terlambat bicara",
      "hyperaktif": "hyperaktif",
      // ... dan seterusnya
    },
    "sumber": {
      "google": "internet",
      "googling": "internet",
      "instagram": "social media",
      // ... dan seterusnya
    }
  }
}
```

## 📊 Mapping yang Tersedia

### Keluhan Mapping

#### Terlambat Bicara
- `sulit bicara` → `terlambat bicara`
- `terlambat bicara` → `terlambat bicara`
- `belum bisa bicara` → `terlambat bicara`
- `belum lancar bicara` → `terlambat bicara`
- `speech delay` → `terlambat bicara`
- `keterlambatan bicara` → `terlambat bicara`
- `belum bisa ngomong` → `terlambat bicara`
- `belum bisa berbicara` → `terlambat bicara`

#### Kurang Fokus
- `sulit fokus` → `kurang fokus`
- `kurang fokus` → `kurang fokus`
- `tidak fokus` → `kurang fokus`
- `attention deficit` → `kurang fokus`
- `konsentrasi rendah` → `kurang fokus`
- `tidak bisa fokus` → `kurang fokus`
- `belum bisa fokus` → `kurang fokus`

#### Hyperaktif
- `hyperaktif` → `hyperaktif`
- `hiperaktif` → `hyperaktif`
- `sangat aktif` → `hyperaktif`
- `tidak bisa diam` → `hyperaktif`
- `over aktif` → `hyperaktif`
- `terlalu aktif` → `hyperaktif`

#### Sering Tantrum
- `sering tantrum` → `sering tantrum`
- `tantrum` → `sering tantrum`
- `mudah marah` → `sering tantrum`
- `emosi tidak stabil` → `sering tantrum`
- `sering ngamuk` → `sering tantrum`
- `mudah emosi` → `sering tantrum`

### Sumber Informasi Mapping

#### Internet
- `internet` → `internet`
- `google` → `internet`
- `googling` → `internet`
- `browsing` → `internet`
- `web` → `internet`
- `online` → `internet`
- `search engine` → `internet`

#### Social Media
- `social media` → `social media`
- `sosmed` → `social media`
- `instagram` → `social media`
- `ig` → `social media`
- `facebook` → `social media`
- `fb` → `social media`
- `twitter` → `social media`
- `tiktok` → `social media`
- `youtube` → `social media`
- `sosial media` → `social media`

#### Rekomendasi Teman
- `teman` → `rekomendasi teman`
- `teman sekolah` → `rekomendasi teman`
- `teman-teman` → `rekomendasi teman`
- `rekomendasi teman` → `rekomendasi teman`
- `sahabat` → `rekomendasi teman`
- `kawan` → `rekomendasi teman`

#### Rekomendasi Keluarga
- `saudara` → `rekomendasi keluarga`
- `kakak` → `rekomendasi keluarga`
- `adik` → `rekomendasi keluarga`
- `orang tua` → `rekomendasi keluarga`
- `ibu` → `rekomendasi keluarga`
- `ayah` → `rekomendasi keluarga`
- `nenek` → `rekomendasi keluarga`
- `kakek` → `rekomendasi keluarga`
- `keluarga` → `rekomendasi keluarga`

## 🎯 Contoh Penggunaan

### 1. Ambil Statistik Normalisasi (Semua Data)
```bash
GET /api/dashboard/normalized-stats
```

### 2. Ambil Statistik Normalisasi (1 Bulan Terakhir)
```bash
GET /api/dashboard/normalized-stats?period=1month
```

### 3. Ambil Statistik Normalisasi (Max 10 Item)
```bash
GET /api/dashboard/normalized-stats?maxItems=10
```

### 4. Tambah Mapping Baru untuk Keluhan
```bash
POST /api/dashboard/normalized-stats/mapping
Content-Type: application/json

{
  "type": "keluhan",
  "original": "belum bisa ngomong",
  "normalized": "terlambat bicara"
}
```

### 5. Tambah Mapping Baru untuk Sumber
```bash
POST /api/dashboard/normalized-stats/mapping
Content-Type: application/json

{
  "type": "sumber",
  "original": "fb",
  "normalized": "social media"
}
```

## 🔍 Contoh Normalisasi

### Sebelum Normalisasi (Raw Data)
```
Top Keluhan:
sulit bicara - 2 kasus
terlambat bicara - 3 kasus
belum bisa bicara - 1 kasus
speech delay - 1 kasus

Sumber:
google - 6 kasus
googling - 1 kasus
instagram - 8 kasus
ig - 1 kasus
facebook - 2 kasus
fb - 1 kasus
```

### Setelah Normalisasi
```
Top Keluhan:
terlambat bicara - 7 kasus

Sumber:
social media - 12 kasus
internet - 7 kasus
```

## 🚀 Benefits

### 1. Data Consistency
- Menyeragamkan data yang berbeda-beda
- Mengurangi duplikasi data
- Memudahkan analisis

### 2. Better Analytics
- Analisis yang lebih akurat
- Trend yang lebih jelas
- Insight yang lebih bermakna

### 3. Flexible Mapping
- Mudah menambah mapping baru
- Dapat disesuaikan dengan kebutuhan
- Maintenance yang mudah

### 4. Performance
- Query database yang lebih efisien
- Response time yang lebih cepat
- Storage yang lebih optimal

## 🔧 Technical Notes

### Normalisasi Process
1. Ambil raw data dari database
2. Hitung frekuensi per item
3. Apply mapping untuk normalisasi
4. Gabungkan data yang sama
5. Sort berdasarkan count (descending)
6. Format untuk display

### Mapping Management
- Mapping disimpan dalam memory (runtime)
- Dapat ditambah secara dinamis
- Case-insensitive matching
- Trim whitespace otomatis

### Error Handling
- Validasi input parameter
- Graceful handling untuk data kosong
- Proper error messages
- CORS support

## 📈 Use Cases

### 1. Dashboard Analytics
- Menampilkan top keluhan yang sudah dinormalisasi
- Analisis trend sumber informasi
- Monitoring efektivitas terapi

### 2. Reporting
- Laporan yang lebih akurat
- Data yang konsisten
- Insight yang bermakna

### 3. Data Cleaning
- Membersihkan data yang tidak konsisten
- Standardisasi input
- Quality assurance

### 4. Business Intelligence
- Analisis pola keluhan
- Strategi marketing berdasarkan sumber
- Perencanaan layanan 