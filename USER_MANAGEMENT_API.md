# Dokumentasi Format Input Data Anak (Add & Update)

## Endpoint
- **Tambah (Add):** `POST /api/anak`
- **Update (Edit):** `PUT /api/anak/[id]`

---

## Struktur Data (Request Body)

### 1. Data Utama Anak

| Field                | Tipe Data                | Wajib | Keterangan                        |
|----------------------|--------------------------|-------|------------------------------------|
| full_name            | string (2-100)           | Ya    | Nama lengkap anak                  |
| nomor_anak           | string                   | Tidak | (khusus update) Nomor unik anak    |
| jenis_kelamin        | 'LAKI_LAKI'/'PEREMPUAN'  | Tidak |                                    |
| nick_name            | string/null              | Tidak | Nama panggilan                     |
| birth_date           | string/null (YYYY-MM-DD) | Tidak | Tanggal lahir                      |
| birth_place          | string/null              | Tidak | Tempat lahir                       |
| kewarganegaraan      | string/null              | Tidak |                                    |
| agama                | string/null              | Tidak |                                    |
| anak_ke              | number/null              | Tidak | Anak ke-berapa                     |
| sekolah_kelas        | string/null              | Tidak | Kelas/sekolah                      |
| status               | 'AKTIF'/'CUTI'/'LULUS'/'BERHENTI' | Tidak | Status anak (default: AKTIF)      |
| tanggal_pemeriksaan  | string/null (YYYY-MM-DD) | Tidak |                                    |
| mulai_terapi         | string/null (YYYY-MM-DD) | Tidak |                                    |
| selesai_terapi       | string/null (YYYY-MM-DD) | Tidak |                                    |
| mulai_cuti           | string/null (YYYY-MM-DD) | Tidak |                                    |

---

### 2. Relasi & Sub-Objek

#### a. survey_awal

```
"survey_awal": {
  "mengetahui_yamet_dari": "string/null",
  "penjelasan_mekanisme": true/false/null,
  "bersedia_online": true/false/null,
  "keluhan_orang_tua": ["string", ...],
  "tindakan_orang_tua": ["string", ...],
  "kendala": ["string", ...]
}
```

#### b. ayah & ibu

```
"ayah": {
  "nama": "string/null",
  "tempat_lahir": "string/null",
  "tanggal_lahir": "YYYY-MM-DD/null",
  "usia": number/null,
  "agama": "string/null",
  "alamat_rumah": "string/null",
  "anak_ke": number/null,
  "pernikahan_ke": number/null,
  "usia_saat_menikah": number/null,
  "pendidikan_terakhir": "string/null",
  "pekerjaan_saat_ini": "string/null",
  "telepon": "string/null",
  "email": "string/null",
  "tahun_meninggal": number/null,
  "usia_saat_meninggal": number/null
}
```
*(Struktur ibu sama dengan ayah)*

#### c. riwayat_kehamilan

```
"riwayat_kehamilan": {
  "usia_ibu_saat_hamil": number/null,
  "usia_ayah_saat_hamil": number/null,
  "mual_sulit_makan": true/false/null,
  "asupan_gizi_memadai": true/false/null,
  "perawatan_kehamilan": true/false/null,
  "kehamilan_diinginkan": true/false/null,
  "berat_bayi_semester_normal": true/false/null,
  "diabetes": true/false/null,
  "hipertensi": true/false/null,
  "asma": true/false/null,
  "tbc": true/false/null,
  "merokok": true/false/null,
  "sekitar_perokok_berat": true/false/null,
  "konsumsi_alkohol": true/false/null,
  "konsumsi_obat_obatan": true/false/null,
  "infeksi_virus": true/false/null,
  "kecelakaan_trauma": true/false/null,
  "pendarahan_flek": true/false/null,
  "masalah_pernafasan": true/false/null
}
```

#### d. riwayat_kelahiran

```
"riwayat_kelahiran": {
  "jenis_kelahiran": "NORMAL/CAESAR/Normal/null",
  "alasan_sc": "string/null",
  "bantuan_kelahiran": ["string", ...],
  "is_premature": true/false/null,
  "usia_kelahiran_bulan": number/null,
  "posisi_bayi_saat_lahir": "KEPALA/KAKI/Normal/null",
  "is_sungsang": true/false/null,
  "is_kuning": true/false/null,
  "detak_jantung_anak": "string/null",
  "apgar_score": "string/null",
  "lama_persalinan": "string/null",
  "penolong_persalinan": "DOKTER/BIDAN/DUKUN_BAYI/Dokter_Spesialis/Dokter Spesialis/null",
  "tempat_bersalin": "string/null",
  "cerita_spesifik_kelahiran": "string/null",
  "berat_badan_bayi": number/null,      // kg
  "panjang_badan_bayi": number/null     // cm
}
```

#### e. riwayat_imunisasi

```
"riwayat_imunisasi": {
  "bgc": true/false/null,
  "hep_b1": true/false/null,
  "hep_b2": true/false/null,
  "hep_b3": true/false/null,
  "dpt_1": true/false/null,
  "dpt_2": true/false/null,
  "dpt_3": true/false/null,
  "dpt_booster_1": true/false/null,
  "polio_1": true/false/null,
  "polio_2": true/false/null,
  "polio_3": true/false/null,
  "polio_4": true/false/null,
  "polio_booster_1": true/false/null,
  "campak_1": true/false/null,
  "campak_2": true/false/null,
  "hib_1": true/false/null,
  "hib_2": true/false/null,
  "hib_3": true/false/null,
  "hib_4": true/false/null,
  "mmr_1": true/false/null
}
```

#### f. riwayat_setelah_lahir

```
"riwayat_setelah_lahir": {
  "asi_sampai_usia_bulan": number/null,
  "pernah_jatuh": true/false/null,
  "jatuh_usia_bulan": number/null,
  "jatuh_ketinggian_cm": number/null,
  "pernah_sakit_parah": true/false/null,
  "sakit_parah_usia_bulan": number/null,
  "pernah_panas_tinggi": true/false/null,
  "panas_tinggi_usia_bulan": number/null,
  "disertai_kejang": true/false/null,
  "frekuensi_durasi_kejang": "string/null",
  "pernah_kejang_tanpa_panas": true/false/null,
  "kejang_tanpa_panas_usia_bulan": number/null,
  "sakit_karena_virus": true/false/null,
  "sakit_virus_usia_bulan": number/null,
  "sakit_virus_jenis": "string/null"
}
```

#### g. perkembangan_anak

```
"perkembangan_anak": {
  "tengkurap_ya": true/false/null,
  "tengkurap_usia": "string/null",
  "berguling_ya": true/false/null,
  "berguling_usia": "string/null",
  "duduk_ya": true/false/null,
  "duduk_usia": "string/null",
  "merayap_ya": true/false/null,
  "merayap_usia": "string/null",
  "merangkak_ya": true/false/null,
  "merangkak_usia": "string/null",
  "jongkok_ya": true/false/null,
  "jongkok_usia": "string/null",
  "transisi_berdiri_ya": true/false/null,
  "transisi_berdiri_usia": "string/null",
  "berdiri_tanpa_pegangan_ya": true/false/null,
  "berdiri_tanpa_pegangan_usia": "string/null",
  "berjalan_tanpa_pegangan_ya": true/false/null,
  "berjalan_tanpa_pegangan_usia": "string/null",
  "berlari_ya": true/false/null,
  "berlari_usia": "string/null",
  "melompat_ya": true/false/null,
  "melompat_usia": "string/null",
  // ... (field bicara, emosi, dst, sesuai schema)
}
```

#### h. perilaku_oral_motor, pola_makan, perkembangan_sosial, pola_tidur, penyakit_diderita, hubungan_keluarga, riwayat_pendidikan, pemeriksaan_sebelumnya, terapi_sebelumnya, lampiran
- Struktur dan field mengikuti schema backend (lihat file `app/api/anak/route.ts` dan database).

---

## Catatan Penting
- Semua field opsional/null boleh dihilangkan dari request jika tidak diisi.
- Field array boleh dikirim array kosong atau tidak dikirim sama sekali.
- Untuk update, field yang tidak ingin diubah boleh dihilangkan dari request.
- Format tanggal: `"YYYY-MM-DD"` (string).
- Untuk field baru (misal: `berat_badan_bayi`, `berjalan_tanpa_pegangan_ya`), backend sudah siap menerima.

---

**Saran:**
- Simpan dokumentasi ini di file `USER_MANAGEMENT_API.md` atau file dokumentasi API Anda.
- Pastikan frontend mengikuti struktur ini agar validasi backend tidak gagal.

Jika ingin dokumentasi untuk entitas/relasi lain secara detail, atau ingin file markdown siap pakai, silakan minta! 