# Edit Anak API

## Endpoint

```
PUT /api/anak/[id]
```

## Headers
- **Authorization**: Bearer `<token>`
- **Content-Type**: application/json

## Request Body

Semua field **optional** (boleh hanya mengirim field yang ingin diubah), namun struktur dan tipe data harus sesuai.

### Struktur Data

```jsonc
{
  "nomor_anak": "string",
  "full_name": "string min 2, max 100",
  "nick_name": "string/null",
  "birth_date": "YYYY-MM-DD/null",
  "birth_place": "string/null",
  "kewarganegaraan": "string/null",
  "agama": "string/null",
  "anak_ke": 1,
  "sekolah_kelas": "string/null",
  "status": "AKTIF | CUTI | LULUS | BERHENTI",
  "tanggal_pemeriksaan": "YYYY-MM-DD/null",
  "mulai_terapi": "YYYY-MM-DD/null",
  "selesai_terapi": "YYYY-MM-DD/null",
  "mulai_cuti": "YYYY-MM-DD/null",

  "survey_awal": {
    "mengetahui_yamet_dari": "string/null",
    "penjelasan_mekanisme": true,
    "bersedia_online": true,
    "keluhan_orang_tua": ["string"],
    "tindakan_orang_tua": ["string"],
    "kendala": ["string"]
  },

  "ayah": {
    "nama": "string/null",
    "tempat_lahir": "string/null",
    "tanggal_lahir": "YYYY-MM-DD/null",
    "usia": 40,
    "agama": "string/null",
    "alamat_rumah": "string/null",
    "anak_ke": 1,
    "pernikahan_ke": 1,
    "usia_saat_menikah": 30,
    "pendidikan_terakhir": "string/null",
    "pekerjaan_saat_ini": "string/null",
    "telepon": "string/null",
    "email": "string/null",
    "tahun_meninggal": 2020,
    "usia_saat_meninggal": 60
  },

  "ibu": { ...sama seperti ayah... },

  "riwayat_kehamilan": {
    "usia_ibu_saat_hamil": 30,
    "usia_ayah_saat_hamil": 32,
    "mual_sulit_makan": true,
    "asupan_gizi_memadai": true,
    "perawatan_kehamilan": true,
    "kehamilan_diinginkan": true,
    "berat_bayi_semester_normal": true,
    "diabetes": false,
    "hipertensi": false,
    "asma": false,
    "tbc": false,
    "merokok": false,
    "sekitar_perokok_berat": false,
    "konsumsi_alkohol": false,
    "konsumsi_obat_obatan": false,
    "infeksi_virus": false,
    "kecelakaan_trauma": false,
    "pendarahan_flek": false,
    "masalah_pernafasan": false
  },

  "riwayat_kelahiran": {
    "jenis_kelahiran": "NORMAL | CAESAR",
    "alasan_sc": "string/null",
    "bantuan_kelahiran": ["string"],
    "is_premature": true,
    "usia_kelahiran_bulan": 9,
    "posisi_bayi_saat_lahir": "KEPALA | KAKI",
    "is_sungsang": false,
    "is_kuning": false,
    "detak_jantung_anak": "string/null",
    "apgar_score": "string/null",
    "lama_persalinan": "string/null",
    "penolong_persalinan": "DOKTER | BIDAN | DUKUN_BAYI",
    "tempat_bersalin": "string/null",
    "cerita_spesifik_kelahiran": "string/null"
  },

  "riwayat_imunisasi": {
    "bgc": true,
    "hep_b1": true,
    "hep_b2": true,
    "hep_b3": true,
    "dpt_1": true,
    "dpt_2": true,
    "dpt_3": true,
    "dpt_booster_1": true,
    "polio_1": true,
    "polio_2": true,
    "polio_3": true,
    "polio_4": true,
    "polio_booster_1": true,
    "campak_1": true,
    "campak_2": true,
    "hib_1": true,
    "hib_2": true,
    "hib_3": true,
    "hib_4": true,
    "mmr_1": true
  },

  "riwayat_setelah_lahir": {
    "asi_sampai_usia_bulan": 6,
    "pernah_jatuh": false,
    "jatuh_usia_bulan": 0,
    "jatuh_ketinggian_cm": 0,
    "pernah_sakit_parah": false,
    "sakit_parah_usia_bulan": 0,
    "pernah_panas_tinggi": false,
    "panas_tinggi_usia_bulan": 0,
    "disertai_kejang": false,
    "frekuensi_durasi_kejang": "string/null",
    "pernah_kejang_tanpa_panas": false,
    "kejang_tanpa_panas_usia_bulan": 0,
    "sakit_karena_virus": false,
    "sakit_virus_usia_bulan": 0,
    "sakit_virus_jenis": "string/null"
  },

  "perkembangan_anak": {
    "tengkurap_ya": true,
    "tengkurap_usia": "string/null",
    "...": "..."
  },

  "perilaku_oral_motor": {
    "mengeces": false,
    "makan_makanan_keras": true,
    "...": "..."
  },

  "pola_makan": {
    "pola_teratur": "string/null",
    "ada_pantangan_makanan": false,
    "pantangan_makanan": "string/null",
    "keterangan_lainnya": "string/null"
  },

  "perkembangan_sosial": {
    "perilaku_bertemu_orang_baru": "string/null",
    "...": "..."
  },

  "pola_tidur": {
    "jam_tidur_teratur": true,
    "sering_terbangun": false,
    "jam_tidur_malam": "string/null",
    "jam_bangun_pagi": "string/null"
  },

  "penyakit_diderita": {
    "sakit_telinga": false,
    "sakit_telinga_usia_tahun": 0,
    "sakit_telinga_penjelasan": "string/null",
    "sakit_mata": false,
    "sakit_mata_usia_tahun": 0,
    "sakit_mata_penjelasan": "string/null",
    "luka_kepala": false,
    "luka_kepala_usia_tahun": 0,
    "penyakit_lainnya": "string/null"
  },

  "hubungan_keluarga": {
    "tinggal_dengan": ["string"],
    "tinggal_dengan_lainnya": "string/null",
    "hubungan_ayah_ibu": "string/null",
    "...": "..."
  },

  "riwayat_pendidikan": {
    "mulai_sekolah_formal_usia": "string/null",
    "keluhan_guru": ["string"],
    "...": "..."
  },

  "pemeriksaan_sebelumnya": [
    {
      "tempat": "string/null",
      "usia": "string/null",
      "diagnosa": "string/null"
    }
  ],

  "terapi_sebelumnya": [
    {
      "jenis_terapi": "string/null",
      "frekuensi": "string/null",
      "lama_terapi": "string/null",
      "tempat": "string/null"
    }
  ],

  "lampiran": {
    "hasil_eeg_url": "string/null",
    "hasil_bera_url": "string/null",
    "hasil_ct_scan_url": "string/null",
    "program_terapi_3bln_url": "string/null",
    "hasil_psikologis_psikiatris_url": "string/null",
    "keterangan_tambahan": "string/null"
  }
}
```

> **Catatan:**
> - Semua field boleh dikirim sebagian saja (hanya yang ingin diubah).
> - Tipe data harus sesuai.
> - Untuk field tanggal, gunakan format string ISO (YYYY-MM-DD).
> - Untuk array, jika tidak ada data bisa dikirim array kosong (`[]`).
> - Untuk field yang nullable, bisa dikirim `null` jika ingin mengosongkan.

---

## Contoh Request

```http
PUT /api/anak/123
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Budi Santoso",
  "status": "AKTIF",
  "perkembangan_anak": {
    "tengkurap_ya": true,
    "tengkurap_usia": "3 bulan"
  }
}
```

---

## Response Sukses

```json
{
  "status": "success",
  "message": "Data anak berhasil diperbarui",
  "data": {
    "anak": { /* data anak terbaru */ }
  }
}
``` 