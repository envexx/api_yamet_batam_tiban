# Dashboard Stats Simplification Update

## Ringkasan Perubahan

Dashboard stats API telah disederhanakan untuk mengurangi kompleksitas data dan memudahkan frontend dalam memproses response. Perubahan utama meliputi:

1. **Period Filtering yang Disederhanakan**
2. **Response Structure yang Lebih Sederhana**
3. **Insight Data yang Dikurangi**

---

## 1. Period Filtering Baru

### Sebelumnya:
- `month`, `quarter`, `year`, `3month`, `1year`, `3year`

### Sekarang:
- `1month` - 1 bulan terakhir (per minggu)
- `4month` - 4 bulan terakhir (per bulan)
- `6month` - 6 bulan terakhir (per bulan)
- `1year` - 1 tahun terakhir (per bulan)
- `all` - Semua waktu (per tahun)

### Contoh Request:
```bash
GET /api/dashboard/stats?period=1month
GET /api/dashboard/stats?period=4month
GET /api/dashboard/stats?period=6month
GET /api/dashboard/stats?period=1year
GET /api/dashboard/stats?period=all
```

---

## 2. Response Structure yang Disederhanakan

### Sebelumnya (Kompleks):
```json
{
  "data": {
    "total_anak": 150,
    "growth": [...],
    "insight": {
      "klinis": { "top_keluhan": [...], "milestone_delay": {...}, ... },
      "demografi": { "age_distribution": {...}, "family_structure": {...}, ... },
      "operasional": { "referral_source": {...}, "assessment_to_treatment_conversion": 80, ... },
      "prediktif": { "early_warning_count": 2, "therapy_success_count": 5, ... },
      "bisnis": { "avg_therapy_duration_month": 4.2 }
    }
  }
}
```

### Sekarang (Sederhana):
```json
{
  "data": {
    "total_anak": 150,
    "anak_keluar_bulan_lalu": 5,
    "anak_keluar_bulan_ini": 3,
    "anak_aktif": 142,
    "growth": [
      { "period": "Minggu 1", "count": 12 },
      { "period": "Minggu 2", "count": 8 },
      { "period": "Minggu 3", "count": 15 },
      { "period": "Minggu 4", "count": 10 }
    ],
    "period": "1month",
    "filter_applied": "2025-01-15T00:00:00.000Z",
    "insight": {
      "top_keluhan": ["Terlambat Bicara", "Hiperaktif", "Kesulitan Belajar"],
      "age_distribution": { "<2": 45, "2-4": 60, "4-6": 35, ">6": 10 },
      "referral_source": { "Dokter": 40, "Guru": 25, "Orang Tua": 35 },
      "therapy_success_count": 25,
      "avg_therapy_duration_month": 6.5
    }
  }
}
```

---

## 3. Insight Data yang Dikurangi

### Data yang Dihapus:
- `milestone_delay`
- `risk_factor_count`
- `imunisasi_gap`
- `family_structure`
- `parental_education`
- `geographic`
- `assessment_to_treatment_conversion`
- `previous_therapy_count`
- `consultation_preference`
- `early_warning_count`
- `seasonal_pattern`
- `family_compliance`

### Data yang Dipertahankan:
- `top_keluhan` (hanya top 3, format array string)
- `age_distribution`
- `referral_source`
- `therapy_success_count`
- `avg_therapy_duration_month`

---

## 4. Growth Data Format

### 1month (4 minggu):
```json
[
  { "period": "Minggu 1", "count": 12 },
  { "period": "Minggu 2", "count": 8 },
  { "period": "Minggu 3", "count": 15 },
  { "period": "Minggu 4", "count": 10 }
]
```

### 4month/6month/1year (per bulan):
```json
[
  { "period": "Jan 25", "count": 15 },
  { "period": "Feb 25", "count": 12 },
  { "period": "Mar 25", "count": 18 },
  { "period": "Apr 25", "count": 14 }
]
```

### all (per tahun):
```json
[
  { "period": "2023", "count": 120 },
  { "period": "2024", "count": 180 },
  { "period": "2025", "count": 45 }
]
```

---

## 5. Frontend Integration

### Contoh Penggunaan:
```javascript
// Fetch data
const fetchStats = async (period = '1month') => {
  const res = await fetch(`/api/dashboard/stats?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.data;
};

// Tampilkan data
const stats = await fetchStats('1month');

// Growth chart
const growthLabels = stats.growth.map(item => item.period);
const growthData = stats.growth.map(item => item.count);

// Top keluhan
const topKeluhan = stats.insight.top_keluhan;
topKeluhan.forEach((keluhan, index) => {
  console.log(`${index + 1}. ${keluhan}`);
});

// Distribusi usia
const ageDist = stats.insight.age_distribution;
Object.entries(ageDist).forEach(([age, count]) => {
  console.log(`${age} tahun: ${count} anak`);
});
```

---

## 6. Role-based Access

### SUPERADMIN:
- Semua data + `total_admin`, `total_manajer`, `total_terapis`
- Insight lengkap

### ADMIN:
- Data terapis + insight lengkap
- Tidak ada `total_admin`, `total_manajer`

### TERAPIS/MANAJER:
- Data dasar + insight terbatas
- Hanya `top_keluhan` dan `age_distribution`

---

## 7. Keuntungan Perubahan

1. **Response Size Lebih Kecil**: Mengurangi bandwidth dan loading time
2. **Frontend Processing Lebih Mudah**: Data sudah dalam format yang siap digunakan
3. **Maintenance Lebih Mudah**: Logika backend lebih sederhana
4. **Performance Lebih Baik**: Query database lebih efisien
5. **Error Handling Lebih Mudah**: Struktur response yang konsisten

---

## 8. Migration Guide

### Untuk Frontend:
1. Update period parameter dari `month` ke `1month`
2. Update struktur response parsing
3. Hapus referensi ke insight yang sudah dihapus
4. Update chart labels sesuai format baru

### Contoh Migration:
```javascript
// Sebelum
const stats = await fetchStats('month');
const topKeluhan = stats.insight.klinis.top_keluhan;

// Sesudah
const stats = await fetchStats('1month');
const topKeluhan = stats.insight.top_keluhan;
```

---

## 9. Testing

### Test Cases:
1. Test semua period: `1month`, `4month`, `6month`, `1year`, `all`
2. Test role-based access
3. Test dengan data kosong
4. Test dengan filter waktu yang berbeda
5. Test response format untuk setiap role

### Expected Results:
- Response time < 2 detik
- Response size < 10KB
- Data accuracy sesuai filter
- Role-based access working correctly

---

## 10. Rollback Plan

Jika diperlukan rollback:
1. Restore file `app/api/dashboard/stats/route.ts` ke versi sebelumnya
2. Update dokumentasi kembali
3. Notify frontend team untuk update struktur response

---

## Kontak & Support

Untuk pertanyaan atau masalah terkait perubahan ini, silakan hubungi tim backend atau buka issue di repository project. 