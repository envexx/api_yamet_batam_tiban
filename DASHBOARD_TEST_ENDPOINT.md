# Dashboard Stats Test Endpoint

## Deskripsi
Endpoint ini dibuat khusus untuk testing dashboard stats tanpa perlu authentication. **Hanya gunakan untuk development/testing, jangan gunakan di production.**

---

## Endpoint

```
GET /api/dashboard/stats/test?period={period}
```

### Parameter Query
| Nama    | Tipe   | Opsi                | Default   | Deskripsi                                    |
|---------|--------|---------------------|-----------|----------------------------------------------|
| period  | string | 1month, 4month, 6month, 1year, all | 1month    | Rentang waktu data insight yang diambil      |

---

## Contoh Request

### 1. Test 1 Bulan Terakhir
```bash
curl -X GET "http://localhost:3000/api/dashboard/stats/test?period=1month"
```

### 2. Test 4 Bulan Terakhir
```bash
curl -X GET "http://localhost:3000/api/dashboard/stats/test?period=4month"
```

### 3. Test 6 Bulan Terakhir
```bash
curl -X GET "http://localhost:3000/api/dashboard/stats/test?period=6month"
```

### 4. Test 1 Tahun Terakhir
```bash
curl -X GET "http://localhost:3000/api/dashboard/stats/test?period=1year"
```

### 5. Test Semua Waktu
```bash
curl -X GET "http://localhost:3000/api/dashboard/stats/test?period=all"
```

---

## Response Format

```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully (TEST MODE)",
  "data": {
    "total_anak": 150,
    "total_admin": 3,
    "total_terapis": 12,
    "total_manajer": 2,
    "total_orangtua": 150,
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
  },
  "note": "This is a test endpoint without authentication. Use for testing only."
}
```

---

## Growth Data Format Berdasarkan Period

### 1. **1month** (1 bulan terakhir)
```json
[
  { "period": "Minggu 1", "count": 12 },
  { "period": "Minggu 2", "count": 8 },
  { "period": "Minggu 3", "count": 15 },
  { "period": "Minggu 4", "count": 10 }
]
```

### 2. **4month** (4 bulan terakhir)
```json
[
  { "period": "Jan 25", "count": 15 },
  { "period": "Feb 25", "count": 12 },
  { "period": "Mar 25", "count": 18 },
  { "period": "Apr 25", "count": 14 }
]
```

### 3. **6month** (6 bulan terakhir)
```json
[
  { "period": "Nov 24", "count": 10 },
  { "period": "Dec 24", "count": 8 },
  { "period": "Jan 25", "count": 15 },
  { "period": "Feb 25", "count": 12 },
  { "period": "Mar 25", "count": 18 },
  { "period": "Apr 25", "count": 14 }
]
```

### 4. **1year** (1 tahun terakhir)
```json
[
  { "period": "Mei 24", "count": 10 },
  { "period": "Jun 24", "count": 8 },
  { "period": "Jul 24", "count": 15 },
  { "period": "Agu 24", "count": 12 },
  { "period": "Sep 24", "count": 18 },
  { "period": "Okt 24", "count": 14 },
  { "period": "Nov 24", "count": 10 },
  { "period": "Dec 24", "count": 8 },
  { "period": "Jan 25", "count": 15 },
  { "period": "Feb 25", "count": 12 },
  { "period": "Mar 25", "count": 18 },
  { "period": "Apr 25", "count": 14 }
]
```

### 5. **all** (Semua waktu)
```json
[
  { "period": "2023", "count": 120 },
  { "period": "2024", "count": 180 },
  { "period": "2025", "count": 45 }
]
```

---

## Testing dengan Browser

### 1. Buka browser dan akses:
```
http://localhost:3000/api/dashboard/stats/test
```

### 2. Test dengan period berbeda:
```
http://localhost:3000/api/dashboard/stats/test?period=1month
http://localhost:3000/api/dashboard/stats/test?period=4month
http://localhost:3000/api/dashboard/stats/test?period=6month
http://localhost:3000/api/dashboard/stats/test?period=1year
http://localhost:3000/api/dashboard/stats/test?period=all
```

---

## Testing dengan JavaScript/Frontend

### Fetch Data
```javascript
const testDashboardStats = async (period = '1month') => {
  try {
    const response = await fetch(`/api/dashboard/stats/test?period=${period}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Dashboard Stats:', data.data);
      return data.data;
    } else {
      console.error('Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// Test semua period
const testAllPeriods = async () => {
  const periods = ['1month', '4month', '6month', '1year', 'all'];
  
  for (const period of periods) {
    console.log(`\n=== Testing ${period} ===`);
    const stats = await testDashboardStats(period);
    if (stats) {
      console.log('Total Anak:', stats.total_anak);
      console.log('Growth Data:', stats.growth);
      console.log('Top Keluhan:', stats.insight.top_keluhan);
    }
  }
};

// Jalankan test
testAllPeriods();
```

### Test Chart Data
```javascript
const testChartData = async (period = '1month') => {
  const stats = await testDashboardStats(period);
  
  if (stats && stats.growth) {
    const labels = stats.growth.map(item => item.period);
    const data = stats.growth.map(item => item.count);
    
    console.log('Chart Labels:', labels);
    console.log('Chart Data:', data);
    
    // Untuk Chart.js
    const chartConfig = {
      labels: labels,
      datasets: [{
        label: 'Pertumbuhan Anak',
        data: data,
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54,162,235,0.2)',
      }]
    };
    
    console.log('Chart Config:', chartConfig);
    return chartConfig;
  }
  
  return null;
};
```

---

## Validasi Data

### 1. **Cek Filter Waktu**
- Pastikan `filter_applied` sesuai dengan period yang dipilih
- Untuk `all`, seharusnya `filter_applied` = "all_time"

### 2. **Cek Growth Data**
- `1month`: 4 data (Minggu 1-4)
- `4month`: 4 data (nama bulan)
- `6month`: 6 data (nama bulan)
- `1year`: 12 data (nama bulan)
- `all`: N data (tahun)

### 3. **Cek Insight Data**
- `top_keluhan`: Array dengan maksimal 3 string
- `age_distribution`: Object dengan 4 key (`<2`, `2-4`, `4-6`, `>6`)
- `referral_source`: Object dengan data referral
- `therapy_success_count`: Number
- `avg_therapy_duration_month`: Number

---

## Troubleshooting

### 1. **Data Kosong**
- Pastikan database memiliki data anak
- Pastikan field `tanggal_pemeriksaan` terisi
- Cek apakah ada data survey awal

### 2. **Growth Data 0**
- Pastikan ada data dengan `tanggal_pemeriksaan` dalam range filter
- Cek format tanggal di database

### 3. **Error 500**
- Cek console server untuk error detail
- Pastikan Prisma client terhubung dengan database

---

## Keamanan

⚠️ **PERINGATAN**: Endpoint ini tidak memiliki authentication dan hanya untuk testing!

- Jangan deploy ke production
- Jangan expose ke public network
- Hapus endpoint ini setelah testing selesai
- Gunakan hanya di development environment

---

## Cleanup

Setelah testing selesai, hapus endpoint ini:

```bash
rm app/api/dashboard/stats/test/route.ts
```

Atau rename file untuk disable sementara:
```bash
mv app/api/dashboard/stats/test/route.ts app/api/dashboard/stats/test/route.ts.disabled
``` 