# Saran & Ringkasan Integrasi Frontend (Schema Baru)

## 1. Endpoint Data Anak (CRUD)

### a. Ambil Semua Anak
**URL:**
`GET /api/anak`

- Mengembalikan array anak beserta seluruh relasi detail (survey, orang tua, riwayat, perkembangan, dsb).
- Data sudah nested, siap dipakai frontend.

**Contoh Response:**
```json
{
  "status": "success",
  "message": "Daftar anak beserta detail",
  "data": [
    {
      "id": 1,
      "nomor_anak": "YAMET-2024-0001",
      "full_name": "Seeder Anak Lengkap",
      "nick_name": "Anak1",
      "birth_date": "2018-05-10",
      "birth_place": "Batam",
      "kewarganegaraan": "Indonesia",
      "agama": "Islam",
      "anak_ke": 1,
      "sekolah_kelas": "TK B",
      "status": "AKTIF",
      "survey_awal": {
        "mengetahui_yamet_dari": "Internet",
        "penjelasan_mekanisme": true,
        "bersedia_online": true,
        "keluhan_orang_tua": ["Sulit bicara", "Sering tantrum"],
        "tindakan_orang_tua": ["Sudah terapi", "Konsultasi dokter"],
        "kendala": ["Biaya", "Jarak jauh"]
      },
      "ayah": { ... },
      "ibu": { ... },
      "riwayat_kehamilan": { ... },
      "riwayat_kelahiran": { ... },
      "riwayat_imunisasi": { ... },
      "riwayat_setelah_lahir": { ... },
      "perkembangan_anak": { ... },
      "perilaku_oral_motor": { ... },
      "pola_makan": { ... },
      "perkembangan_sosial": { ... },
      "pola_tidur": { ... },
      "penyakit_diderita": { ... },
      "hubungan_keluarga": { ... },
      "riwayat_pendidikan": { ... },
      "pemeriksaan_sebelumnya": [ ... ],
      "terapi_sebelumnya": [ ... ],
      "lampiran": { ... },
      "created_by": { "id": 2, "full_name": "Admin" },
      "created_at": "2024-06-23T04:46:00.000Z"
    }
  ]
}
```

### b. Ambil Detail Anak
**URL:**
`GET /api/anak/{id}`

- Mengembalikan satu anak beserta seluruh relasi detail (struktur sama seperti di atas, hanya satu objek).

### c. Tambah Anak
**URL:**
`POST /api/anak`
- Kirim data lengkap anak dan seluruh relasi (nested create).

### d. Update Anak
**URL:**
`PUT /api/anak/{id}`
- Kirim data yang ingin diupdate, bisa partial atau full (nested update).

### e. Hapus Anak
**URL:**
`DELETE /api/anak/{id}`
- Menghapus anak beserta seluruh relasi terkait.

---

## 2. Saran Struktur Data di Frontend
- **Gunakan tab/accordion/section** untuk memisahkan bagian: Data Anak, Survey Awal, Data Ayah, Data Ibu, Riwayat Kehamilan, Kelahiran, Imunisasi, Perkembangan, dll.
- **Ambil data sekali saja** (GET /api/anak atau GET /api/anak/{id}), lalu render seluruh relasi dari response.
- **Untuk form input/edit:** gunakan struktur nested sesuai response agar mudah di-submit ke backend.
- **Jika ingin menampilkan riwayat/terapi sebelumnya:** gunakan array `pemeriksaan_sebelumnya` dan `terapi_sebelumnya`.
- **Lampiran**: tampilkan link/download jika ada URL file.

---

## 3. Catatan Penting
- **Semua relasi sudah di-nest** di response, tidak perlu fetch per relasi.
- **Jika ingin pagination/filter/search:** bisa ditambahkan query param di endpoint `/api/anak?search=...&page=1&limit=10`.
- **Error handling:** backend akan mengembalikan status dan message yang jelas, gunakan untuk feedback user.
- **Jika ada kebutuhan struktur khusus,** silakan request ke backend!

---

### Contoh Struktur Data untuk Frontend (Ringkasan)
```js
{
  id,
  nomor_anak,
  full_name,
  ...,
  survey_awal: { ... },
  ayah: { ... },
  ibu: { ... },
  riwayat_kehamilan: { ... },
  riwayat_kelahiran: { ... },
  riwayat_imunisasi: { ... },
  riwayat_setelah_lahir: { ... },
  perkembangan_anak: { ... },
  perilaku_oral_motor: { ... },
  pola_makan: { ... },
  perkembangan_sosial: { ... },
  pola_tidur: { ... },
  penyakit_diderita: { ... },
  hubungan_keluarga: { ... },
  riwayat_pendidikan: { ... },
  pemeriksaan_sebelumnya: [ ... ],
  terapi_sebelumnya: [ ... ],
  lampiran: { ... },
  created_by: { id, full_name },
  created_at
}
```

---

**Frontend cukup render data sesuai struktur di atas, tidak perlu join/fetch manual.**
Jika ada perubahan skema, backend akan update response agar tetap konsisten. 