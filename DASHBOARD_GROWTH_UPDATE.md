# Update Logika Chart Pertumbuhan Anak Dashboard

## Perubahan yang Dilakukan

### Sebelumnya
Chart Pertumbuhan Anak menggunakan field `mulai_terapi` sebagai patokan untuk menghitung pertumbuhan anak baru.

### Sekarang
Chart Pertumbuhan Anak menggunakan field `tanggal_pemeriksaan` sebagai patokan untuk menghitung pertumbuhan anak baru.

## Alasan Perubahan

1. **Fleksibilitas Data**: Field `tanggal_pemeriksaan` lebih fleksibel dan dapat diinput sesuai kebutuhan
2. **Akurasi Waktu**: Tanggal pemeriksaan lebih akurat untuk menunjukkan kapan anak pertama kali datang
3. **Konsistensi**: Menggunakan tanggal pemeriksaan sebagai patokan yang konsisten

## Implementasi Baru

### Field yang Digunakan
```typescript
// Model Anak
model Anak {
  // ...
  tanggal_pemeriksaan     DateTime? @default(now())
  // ...
}
```

### Logika Chart
```typescript
// Mengambil data berdasarkan tanggal_pemeriksaan
const allGrowthData = await prisma.anak.findMany({
  where: { 
    deleted_at: null, 
    tanggal_pemeriksaan: { 
      not: null,
      gte: filterStart 
    }
  },
  select: { tanggal_pemeriksaan: true },
});
```

### Period yang Didukung

#### 1. **Month (6 bulan terakhir)**
```typescript
// Contoh output: ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "Mei 24", "Jun 24"]
```

#### 2. **Quarter (4 kuartal terakhir)**
```typescript
// Contoh output: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"]
```

#### 3. **Year (3 tahun terakhir)**
```typescript
// Contoh output: ["2022", "2023", "2024"]
```

#### 4. **3month (3 bulan terakhir)**
```typescript
// Contoh output: ["Apr 24", "Mei 24", "Jun 24"]
```

#### 5. **1year (1 tahun terakhir per bulan)**
```typescript
// Contoh output: ["Jul 23", "Agu 23", ..., "Jun 24"]
```

#### 6. **3year (3 tahun terakhir per tahun)**
```typescript
// Contoh output: ["2022", "2023", "2024"]
```

## Contoh Response

### Request
```
GET /api/dashboard/stats?period=month
```

### Response
```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
  "data": {
    "total_anak": 120,
    "total_admin": 5,
    "total_terapis": 20,
    "growth": [
      { "period": "Jan 24", "count": 10 },
      { "period": "Feb 24", "count": 12 },
      { "period": "Mar 24", "count": 15 },
      { "period": "Apr 24", "count": 18 },
      { "period": "Mei 24", "count": 20 },
      { "period": "Jun 24", "count": 22 }
    ]
  }
}
```

## Penggunaan di Frontend

### Chart.js Example
```javascript
import { Line } from 'react-chartjs-2';

const DashboardChart = ({ growthData }) => {
  const data = {
    labels: growthData.map(g => g.period),
    datasets: [
      {
        label: 'Pertumbuhan Anak (Pemeriksaan)',
        data: growthData.map(g => g.count),
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54,162,235,0.2)',
        tension: 0.1
      }
    ]
  };

  return <Line data={data} />;
};
```

### Fetch Data
```javascript
const fetchGrowthData = async (period = 'month') => {
  const response = await fetch(`/api/dashboard/stats?period=${period}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.data.growth;
};
```

## Catatan Penting

1. **Filter Waktu**: Data hanya mengambil anak dengan `tanggal_pemeriksaan` >= `filterStart`
2. **Format Periode**: Menggunakan format Indonesia untuk nama bulan
3. **Null Handling**: Hanya anak dengan `tanggal_pemeriksaan` tidak null yang dihitung
4. **Deleted Records**: Anak yang sudah dihapus (`deleted_at` tidak null) tidak dihitung

## Migration Notes

Jika ada data lama yang menggunakan `mulai_terapi`, pastikan field `tanggal_pemeriksaan` sudah terisi dengan benar. Jika tidak, bisa menggunakan `mulai_terapi` sebagai fallback atau mengisi `tanggal_pemeriksaan` dengan nilai default.

## Testing

Untuk testing, pastikan:
1. Ada data anak dengan `tanggal_pemeriksaan` yang bervariasi
2. Test semua period yang tersedia
3. Verifikasi format output sesuai ekspektasi
4. Test dengan data kosong dan edge cases 