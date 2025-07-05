# Dashboard Stats Backend

## Deskripsi
Endpoint ini menyediakan data statistik dan insight yang disederhanakan untuk dashboard aplikasi. Data dapat difilter berdasarkan periode waktu sehingga frontend dapat menampilkan pola dan tren secara dinamis.

---

## Endpoint

```
GET /api/dashboard/stats?period={period}
```

### Parameter Query
| Nama    | Tipe   | Opsi                | Default   | Deskripsi                                    |
|---------|--------|---------------------|-----------|----------------------------------------------|
| period  | string | 1month, 4month, 6month, 1year, all | 1month    | Rentang waktu data insight yang diambil      |

---

## Struktur Response

```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
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

## Penjelasan Field Statistik

- **total_anak**: Jumlah seluruh anak di database (status apapun, kecuali yang sudah dihapus)
- **anak_keluar_bulan_lalu**: Jumlah anak yang statusnya `BERHENTI` atau `LULUS` dan tanggal `selesai_terapi` berada di bulan lalu
- **anak_keluar_bulan_ini**: Jumlah anak yang statusnya `BERHENTI` atau `LULUS` dan tanggal `selesai_terapi` berada di bulan ini
- **anak_aktif**: Jumlah anak dengan status `AKTIF` dan belum dihapus (masih terapi)
- **growth**: Data pertumbuhan anak baru berdasarkan field `tanggal_pemeriksaan`
  - `period`: Label periode (Minggu 1-4 untuk 1month, nama bulan untuk 4month/6month/1year, tahun untuk all)
  - `count`: Jumlah anak yang melakukan pemeriksaan pada periode tersebut
- **period**: Period yang dipilih dalam request
- **filter_applied**: Tanggal filter yang diterapkan (ISO string) atau "all_time" jika tidak ada filter

---

## Penjelasan Field Insight (Disederhanakan)

### 📊 INSIGHT UTAMA
- **top_keluhan**: 3 keluhan utama orangtua yang paling sering muncul (array string)
- **age_distribution**: Distribusi usia anak dalam kelompok <2, 2-4, 4-6, >6 tahun
- **referral_source**: Sumber informasi pasien mengetahui klinik
- **therapy_success_count**: Jumlah anak yang statusnya LULUS terapi
- **avg_therapy_duration_month**: Rata-rata durasi terapi (bulan) untuk anak yang selesai terapi

---

## Period Filtering

### 1. **1month** (1 bulan terakhir)
- Growth data: 4 minggu terakhir
- Filter: Data dari 1 bulan yang lalu sampai sekarang

### 2. **4month** (4 bulan terakhir)  
- Growth data: 4 bulan terakhir (per bulan)
- Filter: Data dari 4 bulan yang lalu sampai sekarang

### 3. **6month** (6 bulan terakhir)
- Growth data: 6 bulan terakhir (per bulan)
- Filter: Data dari 6 bulan yang lalu sampai sekarang

### 4. **1year** (1 tahun terakhir)
- Growth data: 12 bulan terakhir (per bulan)
- Filter: Data dari 1 tahun yang lalu sampai sekarang

### 5. **all** (Semua waktu)
- Growth data: Semua tahun yang ada data (per tahun)
- Filter: Tidak ada filter waktu (semua data)

---

## Contoh Penggunaan di Frontend

### 1. **Request Data**
```js
fetch('/api/dashboard/stats?period=1month', {
  headers: { 'Authorization': 'Bearer <token>' }
})
  .then(res => res.json())
  .then(data => {
    const stats = data.data;
    console.log('Total Anak:', stats.total_anak);
    console.log('Growth Data:', stats.growth);
    console.log('Top Keluhan:', stats.insight.top_keluhan);
  });
```

### 2. **Menampilkan Chart Growth**
```js
// Untuk chart pertumbuhan anak
const growthData = stats.growth;
const labels = growthData.map(item => item.period);
const values = growthData.map(item => item.count);

// Gunakan dengan library chart seperti Chart.js
```

### 3. **Menampilkan Insight**
```js
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

## Role-based Access

Response berbeda berdasarkan role user:

- **SUPERADMIN**: Semua data + total admin, manajer, terapis
- **ADMIN**: Data terapis + insight lengkap
- **TERAPIS/MANAJER**: Data dasar + insight terbatas

---

## Catatan
- Endpoint ini hanya bisa diakses user yang sudah login dan memiliki token valid
- Response disederhanakan untuk memudahkan frontend processing
- Filter waktu menggunakan field `tanggal_pemeriksaan` sebagai referensi utama
- Jika ada error, cek field `status` dan `message` pada response 