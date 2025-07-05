# POST /api/anak - API Documentation (Updated)

## Endpoint
```
POST /api/anak
```

## Authentication
```
Authorization: Bearer <token>
```

## Request Body Schema

### Required Fields
```json
{
  "full_name": "string (2-100 chars) - REQUIRED"
}
```

### Optional Fields

#### Basic Anak Info
```json
{
  "full_name": "string (2-100 chars) - REQUIRED",
  "jenis_kelamin": "LAKI_LAKI | PEREMPUAN", // WAJIB SESUAI ENUM BACKEND
  "nick_name": "string",
  "birth_date": "YYYY-MM-DD",
  "birth_place": "string",
  "kewarganegaraan": "string",
  "agama": "string",
  "anak_ke": "number",
  "sekolah_kelas": "string",
  "status": "AKTIF | CUTI | LULUS | BERHENTI",
  "tanggal_pemeriksaan": "YYYY-MM-DD",
  "mulai_terapi": "YYYY-MM-DD",
  "selesai_terapi": "YYYY-MM-DD",
  "mulai_cuti": "YYYY-MM-DD"
}
```

#### Survey Awal
```json
{
  "survey_awal": {
    "mengetahui_yamet_dari": "string",
    "penjelasan_mekanisme": "boolean",
    "bersedia_online": "boolean",
    "keluhan_orang_tua": ["string"],
    "tindakan_orang_tua": ["string"],
    "kendala": ["string"]
  }
}
```

#### Data Ayah & Ibu
```json
{
  "ayah": {
    "nama": "string",
    "tempat_lahir": "string",
    "tanggal_lahir": "YYYY-MM-DD",
    "usia": "number",
    "agama": "string",
    "alamat_rumah": "string",
    "anak_ke": "number",
    "pernikahan_ke": "number",
    "usia_saat_menikah": "number",
    "pendidikan_terakhir": "string",
    "pekerjaan_saat_ini": "string",
    "telepon": "string",
    "email": "string",
    "tahun_meninggal": "number",
    "usia_saat_meninggal": "number"
  },
  "ibu": {
    // Same fields as ayah
  }
}
```

#### Riwayat Kehamilan
```json
{
  "riwayat_kehamilan": {
    "usia_ibu_saat_hamil": "number",
    "usia_ayah_saat_hamil": "number",
    "mual_sulit_makan": "boolean",
    "asupan_gizi_memadai": "boolean",
    "perawatan_kehamilan": "boolean",
    "kehamilan_diinginkan": "boolean",
    "berat_bayi_semester_normal": "boolean",
    "diabetes": "boolean",
    "hipertensi": "boolean",
    "asma": "boolean",
    "tbc": "boolean",
    "merokok": "boolean",
    "sekitar_perokok_berat": "boolean",
    "konsumsi_alkohol": "boolean",
    "konsumsi_obat_obatan": "boolean",
    "infeksi_virus": "boolean",
    "kecelakaan_trauma": "boolean",
    "pendarahan_flek": "boolean",
    "masalah_pernafasan": "boolean"
  }
}
```

#### Riwayat Kelahiran
```json
{
  "riwayat_kelahiran": {
    "jenis_kelahiran": "NORMAL | CAESAR | Normal",
    "alasan_sc": "string",
    "bantuan_kelahiran": ["string"],
    "is_premature": "boolean",
    "usia_kelahiran_bulan": "number",
    "posisi_bayi_saat_lahir": "KEPALA | KAKI | Normal",
    "is_sungsang": "boolean",
    "is_kuning": "boolean",
    "detak_jantung_anak": "string",
    "apgar_score": "string",
    "lama_persalinan": "string",
    "penolong_persalinan": "DOKTER | BIDAN | DUKUN_BAYI | Dokter Spesialis",
    "tempat_bersalin": "string",
    "cerita_spesifik_kelahiran": "string"
  }
}
```

#### Riwayat Imunisasi
```json
{
  "riwayat_imunisasi": {
    "bgc": "boolean",
    "hep_b1": "boolean",
    "hep_b2": "boolean",
    "hep_b3": "boolean",
    "dpt_1": "boolean",
    "dpt_2": "boolean",
    "dpt_3": "boolean",
    "dpt_booster_1": "boolean",
    "polio_1": "boolean",
    "polio_2": "boolean",
    "polio_3": "boolean",
    "polio_4": "boolean",
    "polio_booster_1": "boolean",
    "campak_1": "boolean",
    "campak_2": "boolean",
    "hib_1": "boolean",
    "hib_2": "boolean",
    "hib_3": "boolean",
    "hib_4": "boolean",
    "mmr_1": "boolean"
  }
}
```

#### Riwayat Setelah Lahir
```json
{
  "riwayat_setelah_lahir": {
    "asi_sampai_usia_bulan": "number",
    "pernah_jatuh": "boolean",
    "jatuh_usia_bulan": "number",
    "jatuh_ketinggian_cm": "number",
    "pernah_sakit_parah": "boolean",
    "sakit_parah_usia_bulan": "number",
    "pernah_panas_tinggi": "boolean",
    "panas_tinggi_usia_bulan": "number",
    "disertai_kejang": "boolean",
    "frekuensi_durasi_kejang": "string",
    "pernah_kejang_tanpa_panas": "boolean",
    "kejang_tanpa_panas_usia_bulan": "number",
    "sakit_karena_virus": "boolean",
    "sakit_virus_usia_bulan": "number",
    "sakit_virus_jenis": "string"
  }
}
```

#### Perkembangan Anak
```json
{
  "perkembangan_anak": {
    // Motorik Kasar
    "tengkurap_ya": "boolean",
    "tengkurap_usia": "string",
    "berguling_ya": "boolean",
    "berguling_usia": "string",
    "duduk_ya": "boolean",
    "duduk_usia": "string",
    "merayap_ya": "boolean",
    "merayap_usia": "string",
    "merangkak_ya": "boolean",
    "merangkak_usia": "string",
    "jongkok_ya": "boolean",
    "jongkok_usia": "string",
    "transisi_berdiri_ya": "boolean",
    "transisi_berdiri_usia": "string",
    "berdiri_tanpa_pegangan_ya": "boolean",
    "berdiri_tanpa_pegangan_usia": "string",
    "berlari_ya": "boolean",
    "berlari_usia": "string",
    "melompat_ya": "boolean",
    "melompat_usia": "string",
    
    // Bicara dan Bahasa
    "reflek_vokalisasi_ya": "boolean",
    "reflek_vokalisasi_usia": "string",
    "bubbling_ya": "boolean",
    "bubbling_usia": "string",
    "lalling_ya": "boolean",
    "lalling_usia": "string",
    "echolalia_ya": "boolean",
    "echolalia_usia": "string",
    "true_speech_ya": "boolean",
    "true_speech_usia": "string",
    "ungkap_keinginan_2_kata_ya": "boolean",
    "ungkap_keinginan_2_kata_usia": "string",
    "bercerita_ya": "boolean",
    "bercerita_usia": "string",
    
    // Emosi
    "tertarik_lingkungan_luar_ya": "boolean",
    "tertarik_lingkungan_luar_usia": "string",
    "digendong_siapapun_ya": "boolean",
    "digendong_siapapun_usia": "string",
    "interaksi_timbal_balik_ya": "boolean",
    "interaksi_timbal_balik_usia": "string",
    "komunikasi_ekspresi_ibu_ya": "boolean",
    "komunikasi_ekspresi_ibu_usia": "string",
    "ekspresi_emosi_ya": "boolean",
    "ekspresi_emosi_usia": "string"
  }
}
```

#### Perilaku Oral Motor
```json
{
  "perilaku_oral_motor": {
    "mengeces": "boolean",
    "makan_makanan_keras": "boolean",
    "makan_makanan_berkuah": "boolean",
    "pilih_pilih_makanan": "boolean",
    "makan_di_emut": "boolean",
    "mengunyah_saat_makan": "boolean",
    "makan_langsung_telan": "boolean"
  }
}
```

#### Pola Makan
```json
{
  "pola_makan": {
    "pola_teratur": "string",
    "ada_pantangan_makanan": "boolean",
    "pantangan_makanan": "string",
    "keterangan_lainnya": "string"
  }
}
```

#### Perkembangan Sosial
```json
{
  "perkembangan_sosial": {
    "perilaku_bertemu_orang_baru": "string",
    "perilaku_bertemu_teman_sebaya": "string",
    "perilaku_bertemu_orang_lebih_tua": "string",
    "bermain_dengan_banyak_anak": "string",
    "keterangan_lainnya": "string"
  }
}
```

#### Pola Tidur
```json
{
  "pola_tidur": {
    "jam_tidur_teratur": "boolean",
    "sering_terbangun": "boolean",
    "jam_tidur_malam": "string",
    "jam_bangun_pagi": "string"
  }
}
```

#### Penyakit Diderita
```json
{
  "penyakit_diderita": {
    "sakit_telinga": "boolean",
    "sakit_telinga_usia_tahun": "number",
    "sakit_telinga_penjelasan": "string",
    "sakit_mata": "boolean",
    "sakit_mata_usia_tahun": "number",
    "sakit_mata_penjelasan": "string",
    "luka_kepala": "boolean",
    "luka_kepala_usia_tahun": "number",
    "penyakit_lainnya": "string"
  }
}
```

#### Hubungan Keluarga
```json
{
  "hubungan_keluarga": {
    "tinggal_dengan": ["string"],
    "tinggal_dengan_lainnya": "string",
    "hubungan_ayah_ibu": "string",
    "hubungan_ayah_anak": "string",
    "hubungan_ibu_anak": "string",
    "hubungan_saudara_dengan_anak": "string",
    "hubungan_nenek_kakek_dengan_anak": "string",
    "hubungan_saudara_ortu_dengan_anak": "string",
    "hubungan_pengasuh_dengan_anak": "string"
  }
}
```

#### Riwayat Pendidikan
```json
{
  "riwayat_pendidikan": {
    "mulai_sekolah_formal_usia": "string",
    "mulai_sekolah_informal_usia": "string",
    "sekolah_formal_diikuti": "string",
    "sekolah_informal_diikuti": "string",
    "bimbingan_belajar": "boolean",
    "belajar_membaca_sendiri": "boolean",
    "belajar_dibacakan_ortu": "boolean",
    "nilai_rata_rata_sekolah": "string",
    "nilai_tertinggi_mapel": "string",
    "nilai_tertinggi_nilai": "string",
    "nilai_terendah_mapel": "string",
    "nilai_terendah_nilai": "string",
    "keluhan_guru": ["string"]
  }
}
```

#### Pemeriksaan Sebelumnya
```json
{
  "pemeriksaan_sebelumnya": [
    {
      "tempat": "string",
      "usia": "string",
      "diagnosa": "string"
    }
  ]
}
```

#### Terapi Sebelumnya
```json
{
  "terapi_sebelumnya": [
    {
      "jenis_terapi": "string",
      "frekuensi": "string",
      "lama_terapi": "string",
      "tempat": "string"
    }
  ]
}
```

#### Lampiran
```json
{
  "lampiran": {
    "hasil_eeg_url": "string",
    "hasil_bera_url": "string",
    "hasil_ct_scan_url": "string",
    "program_terapi_3bln_url": "string",
    "hasil_psikologis_psikiatris_url": "string",
    "keterangan_tambahan": "string"
  }
}
```

## Mekanisme & Alur Kerja (Versi Terbaru)

1. **User submit form** dari frontend, seluruh data anak dan relasi dikirim dalam satu request.
2. **Backend akan menyimpan data anak utama terlebih dahulu** (insert ke tabel anak).
3. Setelah anak utama berhasil dibuat dan mendapatkan `id`, **backend akan menyimpan semua data relasi satu per satu** (bukan dalam satu transaction, tapi await per await).
4. Jika ada error pada salah satu relasi, data anak utama tetap tersimpan. Error pada relasi akan dicatat di response.
5. Response akan berisi data anak lengkap (beserta relasi yang berhasil), dan summary status setiap relasi (berhasil/gagal).

## Response

### Success (201 Created)
```json
{
  "status": "success",
  "message": "Data anak berhasil dibuat (asynchronous, non-transaction)",
  "data": {
    "anak": { /* complete anak data with all relations */ }
  },
  "relasi_summary": [
    { "relasi": "ayah", "status": "success" },
    { "relasi": "ibu", "status": "success" },
    { "relasi": "riwayat_kelahiran", "status": "failed", "error": "Unique constraint failed on the fields: (`anak_id`)" },
    // ... semua relasi yang diproses
  ],
  "created_at": "2025-01-15T00:00:00.000Z"
}
```

### Partial Success (201 Created)
Jika data anak utama berhasil, tapi ada relasi yang gagal:
```json
{
  "status": "partial_success",
  "message": "Data anak utama berhasil dibuat, namun gagal mengambil data lengkap.",
  "anak_id": 123,
  "relasi_summary": [
    { "relasi": "ayah", "status": "success" },
    { "relasi": "ibu", "status": "failed", "error": "Some error message" }
  ],
  "error": "Gagal mengambil data lengkap anak",
  "created_at": "2025-01-15T00:00:00.000Z"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "status": "error",
  "message": "Data tidak valid",
  "error_type": "VALIDATION_ERROR",
  "details": [
    {
      "field": "full_name",
      "message": "String must contain at least 2 character(s)",
      "code": "too_small"
    }
  ],
  "total_errors": 1
}
```

#### Authentication Error (401)
```json
{
  "status": "error",
  "message": "Akses ditolak. Token tidak valid.",
  "error_type": "AUTHENTICATION_ERROR",
  "details": "Token expired"
}
```

#### Server Error (500)
```json
{
  "status": "error",
  "message": "Terjadi kesalahan server",
  "error_type": "UNEXPECTED_ERROR",
  "details": "Error message",
  "timestamp": "2025-01-15T00:00:00.000Z"
}
```

## Catatan Penting

- **Proses penyimpanan data anak dan relasi sekarang bersifat asynchronous, bukan transaction.**
- **Jika ada error pada relasi, data anak utama tetap tersimpan.**
- **Field `relasi_summary` pada response akan menunjukkan status setiap relasi (success/failed dan error message jika ada).**
- **Nomor Anak**: Auto-generated by backend (YAMET-YYYY-XXXX)
- Field `jenis_kelamin` WAJIB diisi dengan value persis: `"LAKI_LAKI"` atau `"PEREMPUAN"` (huruf besar, underscore, tanpa spasi, sesuai enum backend). Jika value salah (misal: "laki_laki"), backend akan error 400/500.

## Important Notes

1. **Nomor Anak**: Auto-generated by backend (YAMET-YYYY-XXXX)
2. **Transaction**: All data saved in single database transaction
3. **Rollback**: Full rollback on any error
4. **Date Format**: Use YYYY-MM-DD for all date fields
5. **Email Validation**: Email fields are validated
6. **All Related Data**: Optional - can be omitted
7. **Array Fields**: Can contain multiple string values
8. **Boolean Fields**: Use true/false values
9. **Error Handling**: Detailed error information for debugging 