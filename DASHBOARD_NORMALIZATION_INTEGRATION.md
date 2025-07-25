# Integrasi Normalisasi Data ke Dashboard

## 📊 Overview

Sistem normalisasi data telah diintegrasikan ke dalam endpoint dashboard utama (`/api/dashboard/stats`) sehingga data Top Keluhan dan Sumber Informasi yang sudah dinormalisasi dapat langsung ditampilkan di dashboard.

## 🔧 Integrasi yang Dilakukan

### 1. Import Library Normalisasi
```typescript
import { normalizeKeluhan, normalizeSumber, formatNormalizedData } from '../../../lib/data-normalizer';
```

### 2. Normalisasi Data Keluhan
```typescript
// --- NORMALISASI DATA KELUHAN ---
// Convert ke format yang dibutuhkan normalizer
const keluhanArray = Object.entries(keluhanCount).map(([keluhan, count]) => ({
  keluhan,
  count
}));

// Normalisasi keluhan
const normalizedKeluhan = normalizeKeluhan(keluhanArray);
const formattedKeluhan = formatNormalizedData(normalizedKeluhan, 5);
```

### 3. Normalisasi Data Sumber Informasi
```typescript
// --- NORMALISASI DATA SUMBER INFORMASI ---
// Convert ke format yang dibutuhkan normalizer
const sumberArray = Object.entries(referralDist).map(([sumber, count]) => ({
  sumber,
  count
}));

// Normalisasi sumber informasi
const normalizedSumber = normalizeSumber(sumberArray);
const formattedSumber = formatNormalizedData(normalizedSumber, 5);
```

### 4. Response Structure Baru

#### Untuk SUPERADMIN, MANAJER, dan ADMIN
```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
  "data": {
    // ... data dashboard lainnya ...
    "normalized_data": {
      "keluhan": {
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
          { "sumber": "instagram", "count": 8 }
        ],
        "normalized_data": [
          {
            "original": "google, googling",
            "normalized": "internet",
            "count": 7
          },
          {
            "original": "instagram, ig",
            "normalized": "social media",
            "count": 9
          }
        ],
        "formatted": "social media\n9 kasus\n\ninternet\n7 kasus",
        "summary": {
          "total_unique_sumber": 2,
          "total_normalized_sumber": 2,
          "top_sumber": {
            "normalized": "social media",
            "count": 9
          }
        }
      }
    }
  }
}
```

## 📋 Data yang Tersedia di Dashboard

### 1. Raw Data
- **keluhan.raw_data**: Data keluhan asli dari database
- **sumber_informasi.raw_data**: Data sumber informasi asli dari database

### 2. Normalized Data
- **keluhan.normalized_data**: Data keluhan yang sudah dinormalisasi
- **sumber_informasi.normalized_data**: Data sumber informasi yang sudah dinormalisasi

### 3. Formatted Data
- **keluhan.formatted**: Data keluhan yang sudah diformat untuk display
- **sumber_informasi.formatted**: Data sumber informasi yang sudah diformat untuk display

### 4. Summary Statistics
- **keluhan.summary**: Ringkasan statistik keluhan
- **sumber_informasi.summary**: Ringkasan statistik sumber informasi

## 🎯 Contoh Penggunaan di Frontend

### 1. Tampilkan Data Normalisasi
```javascript
// Ambil data dashboard
const response = await fetch('/api/dashboard/stats?period=all');
const data = await response.json();

// Tampilkan keluhan yang sudah dinormalisasi
const keluhanFormatted = data.data.normalized_data.keluhan.formatted;
console.log('Top Keluhan (Normalized):', keluhanFormatted);

// Tampilkan sumber informasi yang sudah dinormalisasi
const sumberFormatted = data.data.normalized_data.sumber_informasi.formatted;
console.log('Sumber Informasi (Normalized):', sumberFormatted);
```

### 2. Tampilkan Summary
```javascript
const keluhanSummary = data.data.normalized_data.keluhan.summary;
const sumberSummary = data.data.normalized_data.sumber_informasi.summary;

console.log('Total unique keluhan:', keluhanSummary.total_unique_keluhan);
console.log('Total normalized keluhan:', keluhanSummary.total_normalized_keluhan);
console.log('Top keluhan:', keluhanSummary.top_keluhan);

console.log('Total unique sumber:', sumberSummary.total_unique_sumber);
console.log('Total normalized sumber:', sumberSummary.total_normalized_sumber);
console.log('Top sumber:', sumberSummary.top_sumber);
```

### 3. Tampilkan Raw vs Normalized
```javascript
const rawKeluhan = data.data.normalized_data.keluhan.raw_data;
const normalizedKeluhan = data.data.normalized_data.keluhan.normalized_data;

console.log('Raw keluhan:', rawKeluhan);
console.log('Normalized keluhan:', normalizedKeluhan);
```

## 🔍 Contoh Output

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

### Setelah Normalisasi (Dashboard)
```
Top Keluhan (Normalized):
terlambat bicara
7 kasus

Sumber Informasi (Normalized):
social media
12 kasus

internet
7 kasus
```

## 🚀 Benefits

### 1. Unified Dashboard
- Semua data tersedia dalam satu endpoint
- Tidak perlu multiple API calls
- Konsistensi data

### 2. Real-time Normalisasi
- Data dinormalisasi secara real-time
- Tidak ada delay atau cache
- Data selalu up-to-date

### 3. Flexible Display
- Raw data untuk analisis detail
- Normalized data untuk display
- Formatted data untuk UI
- Summary untuk overview

### 4. Role-based Access
- SUPERADMIN: Akses penuh
- MANAJER: Akses penuh
- ADMIN: Akses penuh
- Role lain: Akses terbatas

## 📊 Mapping yang Digunakan

### Keluhan Mapping (50+ Variasi)
- Terlambat bicara (8 variasi)
- Kurang fokus (7 variasi)
- Hyperaktif (6 variasi)
- Sering tantrum (6 variasi)
- Dan 17 kategori lainnya

### Sumber Informasi Mapping (60+ Variasi)
- Internet (7 variasi)
- Social media (10 variasi)
- Rekomendasi teman (6 variasi)
- Rekomendasi keluarga (9 variasi)
- Dan 9 kategori lainnya

## 🔧 Technical Notes

### Performance
- Normalisasi dilakukan secara real-time
- Tidak ada caching untuk normalisasi
- Response time dapat bervariasi tergantung jumlah data

### Memory Usage
- Mapping disimpan dalam memory
- Tidak ada persistent storage untuk mapping
- Memory usage minimal

### Error Handling
- Graceful handling untuk data kosong
- Fallback ke raw data jika normalisasi gagal
- Proper error messages

## 📈 Use Cases

### 1. Dashboard Widget
```javascript
// Widget untuk menampilkan top keluhan
const topKeluhanWidget = {
  title: 'Top Keluhan',
  data: data.normalized_data.keluhan.formatted,
  summary: data.normalized_data.keluhan.summary
};
```

### 2. Analytics Chart
```javascript
// Chart data untuk analisis
const keluhanChartData = data.normalized_data.keluhan.normalized_data.map(item => ({
  label: item.normalized,
  value: item.count
}));
```

### 3. Reporting
```javascript
// Data untuk laporan
const reportData = {
  raw: data.normalized_data.keluhan.raw_data,
  normalized: data.normalized_data.keluhan.normalized_data,
  summary: data.normalized_data.keluhan.summary
};
```

## 🎯 Next Steps

### 1. Frontend Integration
- Implementasi UI untuk menampilkan data normalisasi
- Chart dan grafik untuk visualisasi
- Filter dan search functionality

### 2. Advanced Features
- Export data normalisasi
- Comparison between periods
- Trend analysis

### 3. Performance Optimization
- Caching untuk data yang sering diakses
- Pagination untuk data besar
- Lazy loading untuk UI

## 📚 Related Documentation

- `DATA_NORMALIZATION_API.md` - Dokumentasi API normalisasi terpisah
- `DATA_NORMALIZATION_SUMMARY.md` - Ringkasan implementasi normalisasi
- `ADMIN_INPUT_STATS_SUMMARY.md` - Statistik inputan admin 