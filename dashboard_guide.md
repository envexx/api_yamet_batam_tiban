# Panduan Integrasi Dashboard Statistik

Panduan ini menjelaskan cara menggunakan endpoint statistik dashboard pada backend, serta tips integrasi ke frontend (misal React, Vue, dsb).

---

## Endpoint Statistik Dashboard

**URL:**
```
GET /api/dashboard/stats
```

**Query Parameter:**
- `period` _(opsional)_: `1month` (default), `4month`, `6month`, `1year`, atau `all`
  - `1month`  → Grafik pertumbuhan anak per minggu (4 minggu terakhir)
  - `4month`  → Grafik pertumbuhan anak per bulan (4 bulan terakhir)
  - `6month`  → Grafik pertumbuhan anak per bulan (6 bulan terakhir)
  - `1year`   → Grafik pertumbuhan anak per bulan (12 bulan terakhir)
  - `all`     → Grafik pertumbuhan anak per tahun (semua waktu)

**Header:**
- `Authorization: Bearer <token>`

---

## Statistik yang Dikembalikan

Response akan berbeda tergantung role user (SUPERADMIN, ADMIN, TERAPIS):

### Contoh Response (SUPERADMIN)
```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
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
  }
}
```

### Penjelasan Field
- **total_anak**: Jumlah seluruh anak yang aktif (belum dihapus)
- **total_admin**: Jumlah user dengan role ADMIN (hanya SUPERADMIN)
- **total_terapis**: Jumlah user dengan role TERAPIS (hanya SUPERADMIN & ADMIN)
- **total_manajer**: Jumlah user dengan role MANAJER (hanya SUPERADMIN)
- **total_orangtua**: Jumlah orangtua terdaftar
- **anak_keluar_bulan_lalu**: Jumlah anak yang keluar (status BERHENTI/LULUS) pada bulan sebelumnya
- **anak_keluar_bulan_ini**: Jumlah anak yang keluar (status BERHENTI/LULUS) pada bulan ini
- **anak_aktif**: Jumlah anak dengan status AKTIF
- **growth**: Data pertumbuhan anak baru berdasarkan field `tanggal_pemeriksaan`
  - `period`: Label periode (Minggu 1-4 untuk 1month, nama bulan untuk 4month/6month/1year, tahun untuk all)
  - `count`: Jumlah anak yang melakukan pemeriksaan pada periode tersebut
- **period**: Period yang dipilih dalam request
- **filter_applied**: Tanggal filter yang diterapkan (ISO string) atau "all_time"
- **insight**: Data insight yang disederhanakan (top keluhan, distribusi usia, dll)

---

## Contoh Integrasi Frontend (React)

### Fetch Data
```js
const fetchStats = async (period = '1month') => {
  const res = await fetch(`/api/dashboard/stats?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.data;
};
```

### Tampilkan Statistik
```js
const stats = await fetchStats('1month');
console.log('Total Anak:', stats.total_anak);
console.log('Anak Aktif:', stats.anak_aktif);
console.log('Growth Data:', stats.growth); // array untuk grafik
console.log('Top Keluhan:', stats.insight.top_keluhan);
```

### Contoh Grafik (menggunakan Chart.js)
```js
import { Line } from 'react-chartjs-2';

const data = {
  labels: stats.growth.map(g => g.period),
  datasets: [
    {
      label: 'Pertumbuhan Anak',
      data: stats.growth.map(g => g.count),
      borderColor: '#36a2eb',
      backgroundColor: 'rgba(54,162,235,0.2)',
    }
  ]
};

<Line data={data} />
```

---

## Tips Integrasi
- **Role-based UI:** Sembunyikan statistik yang tidak relevan untuk role tertentu.
- **Period Selector:** Buat dropdown untuk memilih period (1month/4month/6month/1year/all) dan fetch ulang data.
- **Loading State:** Tampilkan loading saat fetch data.
- **Error Handling:** Tampilkan pesan error jika fetch gagal.
- **Responsive Chart:** Pastikan grafik responsif di mobile/desktop.
- **Data Processing:** Response sudah disederhanakan, langsung bisa digunakan untuk chart dan insight.

---

## Troubleshooting
- Jika data tidak muncul, cek token dan role user.
- Jika growth selalu 0, pastikan field `tanggal_pemeriksaan` diisi pada data anak.
- Untuk statistik anak keluar, pastikan field `selesai_terapi` dan status "BERHENTI"/"LULUS" terisi.
- Response disederhanakan untuk mengurangi kompleksitas data yang dikirim ke frontend.

---

## Kontak & Support
Jika ada pertanyaan lebih lanjut, silakan hubungi tim backend atau buka issue di repository project. 