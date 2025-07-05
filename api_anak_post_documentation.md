# POST /api/anak - API Documentation

## Endpoint
```
POST /api/anak
```

## Description
Membuat data anak baru beserta semua data terkait (orang tua, riwayat, perkembangan, dll) dalam satu transaksi database.

## Authentication
```
Authorization: Bearer <token>
```

## Request Headers
```
Content-Type: application/json
Authorization: Bearer <token>
```

## Request Body Schema

### Basic Anak Info (Required)
```json
{
  "full_name": "string (2-100 chars) - REQUIRED",
  "nick_name": "string - OPTIONAL",
  "birth_date": "string (YYYY-MM-DD) - OPTIONAL",
  "birth_place": "string - OPTIONAL",
  "kewarganegaraan": "string - OPTIONAL",
  "agama": "string - OPTIONAL",
  "anak_ke": "number - OPTIONAL",
  "sekolah_kelas": "string - OPTIONAL",
  "status": "AKTIF | CUTI | LULUS | BERHENTI - DEFAULT: AKTIF",
  "tanggal_pemeriksaan": "string (YYYY-MM-DD) - OPTIONAL",
  "mulai_terapi": "string (YYYY-MM-DD) - OPTIONAL",
  "selesai_terapi": "string (YYYY-MM-DD) - OPTIONAL",
  "mulai_cuti": "string (YYYY-MM-DD) - OPTIONAL"
}
```

### Survey Awal (Optional)
```json
{
  "survey_awal": {
    "mengetahui_yamet_dari": "string - OPTIONAL",
    "penjelasan_mekanisme": "boolean - OPTIONAL",
    "bersedia_online": "boolean - OPTIONAL",
    "keluhan_orang_tua": ["string"] - OPTIONAL,
    "tindakan_orang_tua": ["string"] - OPTIONAL,
    "kendala": ["string"] - OPTIONAL
  }
}
```

### Data Ayah (Optional)
```json
{
  "ayah": {
    "nama": "string - OPTIONAL",
    "tempat_lahir": "string - OPTIONAL",
    "tanggal_lahir": "string (YYYY-MM-DD) - OPTIONAL",
    "usia": "number - OPTIONAL",
    "agama": "string - OPTIONAL",
    "alamat_rumah": "string - OPTIONAL",
    "anak_ke": "number - OPTIONAL",
    "pernikahan_ke": "number - OPTIONAL",
    "usia_saat_menikah": "number - OPTIONAL",
    "pendidikan_terakhir": "string - OPTIONAL",
    "pekerjaan_saat_ini": "string - OPTIONAL",
    "telepon": "string - OPTIONAL",
    "email": "string - OPTIONAL",
    "tahun_meninggal": "number - OPTIONAL",
    "usia_saat_meninggal": "number - OPTIONAL"
  }
}
```

### Data Ibu (Optional)
```json
{
  "ibu": {
    "nama": "string - OPTIONAL",
    "tempat_lahir": "string - OPTIONAL",
    "tanggal_lahir": "string (YYYY-MM-DD) - OPTIONAL",
    "usia": "number - OPTIONAL",
    "agama": "string - OPTIONAL",
    "alamat_rumah": "string - OPTIONAL",
    "anak_ke": "number - OPTIONAL",
    "pernikahan_ke": "number - OPTIONAL",
    "usia_saat_menikah": "number - OPTIONAL",
    "pendidikan_terakhir": "string - OPTIONAL",
    "pekerjaan_saat_ini": "string - OPTIONAL",
    "telepon": "string - OPTIONAL",
    "email": "string - OPTIONAL",
    "tahun_meninggal": "number - OPTIONAL",
    "usia_saat_meninggal": "number - OPTIONAL"
  }
}
```

### Riwayat Kehamilan (Optional)
```json
{
  "riwayat_kehamilan": {
    "usia_ibu_saat_hamil": "number - OPTIONAL",
    "usia_ayah_saat_hamil": "number - OPTIONAL",
    "mual_sulit_makan": "boolean - OPTIONAL",
    "asupan_gizi_memadai": "boolean - OPTIONAL",
    "perawatan_kehamilan": "boolean - OPTIONAL",
    "kehamilan_diinginkan": "boolean - OPTIONAL",
    "berat_bayi_semester_normal": "boolean - OPTIONAL",
    "diabetes": "boolean - OPTIONAL",
    "hipertensi": "boolean - OPTIONAL",
    "asma": "boolean - OPTIONAL",
    "tbc": "boolean - OPTIONAL",
    "merokok": "boolean - OPTIONAL",
    "sekitar_perokok_berat": "boolean - OPTIONAL",
    "konsumsi_alkohol": "boolean - OPTIONAL",
    "konsumsi_obat_obatan": "boolean - OPTIONAL",
    "infeksi_virus": "boolean - OPTIONAL",
    "kecelakaan_trauma": "boolean - OPTIONAL",
    "pendarahan_flek": "boolean - OPTIONAL",
    "masalah_pernafasan": "boolean - OPTIONAL"
  }
}
```

### Riwayat Kelahiran (Optional)
```json
{
  "riwayat_kelahiran": {
    "jenis_kelahiran": "NORMAL | CAESAR | Normal - OPTIONAL",
    "alasan_sc": "string - OPTIONAL",
    "bantuan_kelahiran": ["string"] - OPTIONAL,
    "is_premature": "boolean - OPTIONAL",
    "usia_kelahiran_bulan": "number - OPTIONAL",
    "posisi_bayi_saat_lahir": "KEPALA | KAKI | Normal - OPTIONAL",
    "is_sungsang": "boolean - OPTIONAL",
    "is_kuning": "boolean - OPTIONAL",
    "detak_jantung_anak": "string - OPTIONAL",
    "apgar_score": "string - OPTIONAL",
    "lama_persalinan": "string - OPTIONAL",
    "penolong_persalinan": "DOKTER | BIDAN | DUKUN_BAYI | Dokter Spesialis - OPTIONAL",
    "tempat_bersalin": "string - OPTIONAL",
    "cerita_spesifik_kelahiran": "string - OPTIONAL"
  }
}
```

### Riwayat Imunisasi (Optional)
```json
{
  "riwayat_imunisasi": {
    "bgc": "boolean - OPTIONAL",
    "hep_b1": "boolean - OPTIONAL",
    "hep_b2": "boolean - OPTIONAL",
    "hep_b3": "boolean - OPTIONAL",
    "dpt_1": "boolean - OPTIONAL",
    "dpt_2": "boolean - OPTIONAL",
    "dpt_3": "boolean - OPTIONAL",
    "dpt_booster_1": "boolean - OPTIONAL",
    "polio_1": "boolean - OPTIONAL",
    "polio_2": "boolean - OPTIONAL",
    "polio_3": "boolean - OPTIONAL",
    "polio_4": "boolean - OPTIONAL",
    "polio_booster_1": "boolean - OPTIONAL",
    "campak_1": "boolean - OPTIONAL",
    "campak_2": "boolean - OPTIONAL",
    "hib_1": "boolean - OPTIONAL",
    "hib_2": "boolean - OPTIONAL",
    "hib_3": "boolean - OPTIONAL",
    "hib_4": "boolean - OPTIONAL",
    "mmr_1": "boolean - OPTIONAL"
  }
}
```

### Riwayat Setelah Lahir (Optional)
```json
{
  "riwayat_setelah_lahir": {
    "asi_sampai_usia_bulan": "number - OPTIONAL",
    "pernah_jatuh": "boolean - OPTIONAL",
    "jatuh_usia_bulan": "number - OPTIONAL",
    "jatuh_ketinggian_cm": "number - OPTIONAL",
    "pernah_sakit_parah": "boolean - OPTIONAL",
    "sakit_parah_usia_bulan": "number - OPTIONAL",
    "pernah_panas_tinggi": "boolean - OPTIONAL",
    "panas_tinggi_usia_bulan": "number - OPTIONAL",
    "disertai_kejang": "boolean - OPTIONAL",
    "frekuensi_durasi_kejang": "string - OPTIONAL",
    "pernah_kejang_tanpa_panas": "boolean - OPTIONAL",
    "kejang_tanpa_panas_usia_bulan": "number - OPTIONAL",
    "sakit_karena_virus": "boolean - OPTIONAL",
    "sakit_virus_usia_bulan": "number - OPTIONAL",
    "sakit_virus_jenis": "string - OPTIONAL"
  }
}
```

### Perkembangan Anak (Optional)
```json
{
  "perkembangan_anak": {
    // Motorik Kasar
    "tengkurap_ya": "boolean - OPTIONAL",
    "tengkurap_usia": "string - OPTIONAL",
    "berguling_ya": "boolean - OPTIONAL",
    "berguling_usia": "string - OPTIONAL",
    "duduk_ya": "boolean - OPTIONAL",
    "duduk_usia": "string - OPTIONAL",
    "merayap_ya": "boolean - OPTIONAL",
    "merayap_usia": "string - OPTIONAL",
    "merangkak_ya": "boolean - OPTIONAL",
    "merangkak_usia": "string - OPTIONAL",
    "jongkok_ya": "boolean - OPTIONAL",
    "jongkok_usia": "string - OPTIONAL",
    "transisi_berdiri_ya": "boolean - OPTIONAL",
    "transisi_berdiri_usia": "string - OPTIONAL",
    "berdiri_tanpa_pegangan_ya": "boolean - OPTIONAL",
    "berdiri_tanpa_pegangan_usia": "string - OPTIONAL",
    "berlari_ya": "boolean - OPTIONAL",
    "berlari_usia": "string - OPTIONAL",
    "melompat_ya": "boolean - OPTIONAL",
    "melompat_usia": "string - OPTIONAL",
    
    // Bicara dan Bahasa
    "reflek_vokalisasi_ya": "boolean - OPTIONAL",
    "reflek_vokalisasi_usia": "string - OPTIONAL",
    "bubbling_ya": "boolean - OPTIONAL",
    "bubbling_usia": "string - OPTIONAL",
    "lalling_ya": "boolean - OPTIONAL",
    "lalling_usia": "string - OPTIONAL",
    "echolalia_ya": "boolean - OPTIONAL",
    "echolalia_usia": "string - OPTIONAL",
    "true_speech_ya": "boolean - OPTIONAL",
    "true_speech_usia": "string - OPTIONAL",
    "ungkap_keinginan_2_kata_ya": "boolean - OPTIONAL",
    "ungkap_keinginan_2_kata_usia": "string - OPTIONAL",
    "bercerita_ya": "boolean - OPTIONAL",
    "bercerita_usia": "string - OPTIONAL",
    
    // Emosi
    "tertarik_lingkungan_luar_ya": "boolean - OPTIONAL",
    "tertarik_lingkungan_luar_usia": "string - OPTIONAL",
    "digendong_siapapun_ya": "boolean - OPTIONAL",
    "digendong_siapapun_usia": "string - OPTIONAL",
    "interaksi_timbal_balik_ya": "boolean - OPTIONAL",
    "interaksi_timbal_balik_usia": "string - OPTIONAL",
    "komunikasi_ekspresi_ibu_ya": "boolean - OPTIONAL",
    "komunikasi_ekspresi_ibu_usia": "string - OPTIONAL",
    "ekspresi_emosi_ya": "boolean - OPTIONAL",
    "ekspresi_emosi_usia": "string - OPTIONAL"
  }
}
```

### Perilaku Oral Motor (Optional)
```json
{
  "perilaku_oral_motor": {
    "mengeces": "boolean - OPTIONAL",
    "makan_makanan_keras": "boolean - OPTIONAL",
    "makan_makanan_berkuah": "boolean - OPTIONAL",
    "pilih_pilih_makanan": "boolean - OPTIONAL",
    "makan_di_emut": "boolean - OPTIONAL",
    "mengunyah_saat_makan": "boolean - OPTIONAL",
    "makan_langsung_telan": "boolean - OPTIONAL"
  }
}
```

### Pola Makan (Optional)
```json
{
  "pola_makan": {
    "pola_teratur": "string - OPTIONAL",
    "ada_pantangan_makanan": "boolean - OPTIONAL",
    "pantangan_makanan": "string - OPTIONAL",
    "keterangan_lainnya": "string - OPTIONAL"
  }
}
```

### Perkembangan Sosial (Optional)
```json
{
  "perkembangan_sosial": {
    "perilaku_bertemu_orang_baru": "string - OPTIONAL",
    "perilaku_bertemu_teman_sebaya": "string - OPTIONAL",
    "perilaku_bertemu_orang_lebih_tua": "string - OPTIONAL",
    "bermain_dengan_banyak_anak": "string - OPTIONAL",
    "keterangan_lainnya": "string - OPTIONAL"
  }
}
```

### Pola Tidur (Optional)
```json
{
  "pola_tidur": {
    "jam_tidur_teratur": "boolean - OPTIONAL",
    "sering_terbangun": "boolean - OPTIONAL",
    "jam_tidur_malam": "string - OPTIONAL",
    "jam_bangun_pagi": "string - OPTIONAL"
  }
}
```

### Penyakit Diderita (Optional)
```json
{
  "penyakit_diderita": {
    "sakit_telinga": "boolean - OPTIONAL",
    "sakit_telinga_usia_tahun": "number - OPTIONAL",
    "sakit_telinga_penjelasan": "string - OPTIONAL",
    "sakit_mata": "boolean - OPTIONAL",
    "sakit_mata_usia_tahun": "number - OPTIONAL",
    "sakit_mata_penjelasan": "string - OPTIONAL",
    "luka_kepala": "boolean - OPTIONAL",
    "luka_kepala_usia_tahun": "number - OPTIONAL",
    "penyakit_lainnya": "string - OPTIONAL"
  }
}
```

### Hubungan Keluarga (Optional)
```json
{
  "hubungan_keluarga": {
    "tinggal_dengan": ["string"] - OPTIONAL,
    "tinggal_dengan_lainnya": "string - OPTIONAL",
    "hubungan_ayah_ibu": "string - OPTIONAL",
    "hubungan_ayah_anak": "string - OPTIONAL",
    "hubungan_ibu_anak": "string - OPTIONAL",
    "hubungan_saudara_dengan_anak": "string - OPTIONAL",
    "hubungan_nenek_kakek_dengan_anak": "string - OPTIONAL",
    "hubungan_saudara_ortu_dengan_anak": "string - OPTIONAL",
    "hubungan_pengasuh_dengan_anak": "string - OPTIONAL"
  }
}
```

### Riwayat Pendidikan (Optional)
```json
{
  "riwayat_pendidikan": {
    "mulai_sekolah_formal_usia": "string - OPTIONAL",
    "mulai_sekolah_informal_usia": "string - OPTIONAL",
    "sekolah_formal_diikuti": "string - OPTIONAL",
    "sekolah_informal_diikuti": "string - OPTIONAL",
    "bimbingan_belajar": "boolean - OPTIONAL",
    "belajar_membaca_sendiri": "boolean - OPTIONAL",
    "belajar_dibacakan_ortu": "boolean - OPTIONAL",
    "nilai_rata_rata_sekolah": "string - OPTIONAL",
    "nilai_tertinggi_mapel": "string - OPTIONAL",
    "nilai_tertinggi_nilai": "string - OPTIONAL",
    "nilai_terendah_mapel": "string - OPTIONAL",
    "nilai_terendah_nilai": "string - OPTIONAL",
    "keluhan_guru": ["string"] - OPTIONAL
  }
}
```

### Pemeriksaan Sebelumnya (Optional)
```json
{
  "pemeriksaan_sebelumnya": [
    {
      "tempat": "string - OPTIONAL",
      "usia": "string - OPTIONAL",
      "diagnosa": "string - OPTIONAL"
    }
  ]
}
```

### Terapi Sebelumnya (Optional)
```json
{
  "terapi_sebelumnya": [
    {
      "jenis_terapi": "string - OPTIONAL",
      "frekuensi": "string - OPTIONAL",
      "lama_terapi": "string - OPTIONAL",
      "tempat": "string - OPTIONAL"
    }
  ]
}
```

### Lampiran (Optional)
```json
{
  "lampiran": {
    "hasil_eeg_url": "string - OPTIONAL",
    "hasil_bera_url": "string - OPTIONAL",
    "hasil_ct_scan_url": "string - OPTIONAL",
    "program_terapi_3bln_url": "string - OPTIONAL",
    "hasil_psikologis_psikiatris_url": "string - OPTIONAL",
    "keterangan_tambahan": "string - OPTIONAL"
  }
}
```

## Example Request

```json
{
  "full_name": "Ahmad Fadillah Putra",
  "nick_name": "Fadil",
  "birth_date": "2018-05-15",
  "birth_place": "Jakarta",
  "kewarganegaraan": "Indonesia",
  "agama": "Islam",
  "anak_ke": 1,
  "sekolah_kelas": "TK B",
  "tanggal_pemeriksaan": "2025-01-15",
  "status": "AKTIF",
  "mulai_terapi": "2025-01-20",
  "ayah": {
    "nama": "Ahmad Supriyadi",
    "tempat_lahir": "Jakarta",
    "tanggal_lahir": "1985-03-10",
    "usia": 40,
    "agama": "Islam",
    "alamat_rumah": "Jl. Sudirman No. 123, Jakarta Pusat",
    "anak_ke": 2,
    "pernikahan_ke": 1,
    "usia_saat_menikah": 28,
    "pendidikan_terakhir": "S1",
    "pekerjaan_saat_ini": "Karyawan Swasta",
    "telepon": "081234567890",
    "email": "ahmad.supriyadi@email.com"
  },
  "ibu": {
    "nama": "Siti Nurhaliza",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1988-07-22",
    "usia": 37,
    "agama": "Islam",
    "alamat_rumah": "Jl. Sudirman No. 123, Jakarta Pusat",
    "anak_ke": 1,
    "pernikahan_ke": 1,
    "usia_saat_menikah": 25,
    "pendidikan_terakhir": "S1",
    "pekerjaan_saat_ini": "Guru",
    "telepon": "081234567891",
    "email": "siti.nurhaliza@email.com"
  },
  "survey_awal": {
    "mengetahui_yamet_dari": "Rekomendasi dokter",
    "penjelasan_mekanisme": true,
    "bersedia_online": true,
    "keluhan_orang_tua": ["Kesulitan berbicara", "Hiperaktif"],
    "tindakan_orang_tua": ["Konsultasi dokter", "Terapi wicara"],
    "kendala": ["Jarak jauh", "Biaya"]
  },
  "riwayat_kehamilan": {
    "usia_ibu_saat_hamil": 30,
    "usia_ayah_saat_hamil": 33,
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
    "jenis_kelahiran": "Normal",
    "bantuan_kelahiran": ["Dokter"],
    "is_premature": false,
    "usia_kelahiran_bulan": 9,
    "posisi_bayi_saat_lahir": "Normal",
    "is_sungsang": false,
    "is_kuning": false,
    "detak_jantung_anak": "Normal",
    "apgar_score": "9/10",
    "lama_persalinan": "8 jam",
    "penolong_persalinan": "Dokter Spesialis",
    "tempat_bersalin": "RS Umum",
    "cerita_spesifik_kelahiran": "Persalinan normal tanpa komplikasi"
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
    "asi_sampai_usia_bulan": 24,
    "pernah_jatuh": true,
    "jatuh_usia_bulan": 18,
    "jatuh_ketinggian_cm": 50,
    "pernah_sakit_parah": false,
    "pernah_panas_tinggi": true,
    "panas_tinggi_usia_bulan": 12,
    "disertai_kejang": false,
    "pernah_kejang_tanpa_panas": false,
    "sakit_karena_virus": true,
    "sakit_virus_usia_bulan": 6,
    "sakit_virus_jenis": "Demam berdarah"
  },
  "perkembangan_anak": {
    "tengkurap_ya": true,
    "tengkurap_usia": "3 bulan",
    "berguling_ya": true,
    "berguling_usia": "4 bulan",
    "duduk_ya": true,
    "duduk_usia": "6 bulan",
    "merayap_ya": true,
    "merayap_usia": "7 bulan",
    "merangkak_ya": true,
    "merangkak_usia": "8 bulan",
    "jongkok_ya": true,
    "jongkok_usia": "10 bulan",
    "transisi_berdiri_ya": true,
    "transisi_berdiri_usia": "11 bulan",
    "berdiri_tanpa_pegangan_ya": true,
    "berdiri_tanpa_pegangan_usia": "12 bulan",
    "berlari_ya": true,
    "berlari_usia": "14 bulan",
    "melompat_ya": true,
    "melompat_usia": "18 bulan",
    "reflek_vokalisasi_ya": true,
    "reflek_vokalisasi_usia": "1 bulan",
    "bubbling_ya": true,
    "bubbling_usia": "3 bulan",
    "lalling_ya": true,
    "lalling_usia": "6 bulan",
    "echolalia_ya": true,
    "echolalia_usia": "12 bulan",
    "true_speech_ya": true,
    "true_speech_usia": "18 bulan",
    "ungkap_keinginan_2_kata_ya": true,
    "ungkap_keinginan_2_kata_usia": "24 bulan",
    "bercerita_ya": true,
    "bercerita_usia": "36 bulan",
    "tertarik_lingkungan_luar_ya": true,
    "tertarik_lingkungan_luar_usia": "6 bulan",
    "digendong_siapapun_ya": true,
    "digendong_siapapun_usia": "3 bulan",
    "interaksi_timbal_balik_ya": true,
    "interaksi_timbal_balik_usia": "6 bulan",
    "komunikasi_ekspresi_ibu_ya": true,
    "komunikasi_ekspresi_ibu_usia": "6 bulan",
    "ekspresi_emosi_ya": true,
    "ekspresi_emosi_usia": "12 bulan"
  },
  "perilaku_oral_motor": {
    "mengeces": false,
    "makan_makanan_keras": true,
    "makan_makanan_berkuah": true,
    "pilih_pilih_makanan": true,
    "makan_di_emut": false,
    "mengunyah_saat_makan": true,
    "makan_langsung_telan": false
  },
  "pola_makan": {
    "pola_teratur": "3x sehari",
    "ada_pantangan_makanan": true,
    "pantangan_makanan": "Seafood, kacang",
    "keterangan_lainnya": "Alergi makanan laut"
  },
  "perkembangan_sosial": {
    "perilaku_bertemu_orang_baru": "Ramah",
    "perilaku_bertemu_teman_sebaya": "Aktif",
    "perilaku_bertemu_orang_lebih_tua": "Sopan",
    "bermain_dengan_banyak_anak": "Ya",
    "keterangan_lainnya": "Suka bermain dengan teman"
  },
  "pola_tidur": {
    "jam_tidur_teratur": true,
    "sering_terbangun": false,
    "jam_tidur_malam": "20:00",
    "jam_bangun_pagi": "06:00"
  },
  "penyakit_diderita": {
    "sakit_telinga": false,
    "sakit_mata": false,
    "luka_kepala": false,
    "penyakit_lainnya": "Alergi makanan laut dan debu"
  },
  "hubungan_keluarga": {
    "tinggal_dengan": ["Ayah", "Ibu"],
    "tinggal_dengan_lainnya": "",
    "hubungan_ayah_ibu": "Harmonis",
    "hubungan_ayah_anak": "Baik",
    "hubungan_ibu_anak": "Baik",
    "hubungan_saudara_dengan_anak": "Baik",
    "hubungan_nenek_kakek_dengan_anak": "Baik",
    "hubungan_saudara_ortu_dengan_anak": "Baik",
    "hubungan_pengasuh_dengan_anak": "Baik"
  },
  "riwayat_pendidikan": {
    "mulai_sekolah_formal_usia": "4 tahun",
    "mulai_sekolah_informal_usia": "3 tahun",
    "sekolah_formal_diikuti": "TK",
    "sekolah_informal_diikuti": "PAUD",
    "bimbingan_belajar": true,
    "belajar_membaca_sendiri": true,
    "belajar_dibacakan_ortu": true,
    "nilai_rata_rata_sekolah": "85",
    "nilai_tertinggi_mapel": "Bahasa Indonesia",
    "nilai_tertinggi_nilai": "90",
    "nilai_terendah_mapel": "Matematika",
    "nilai_terendah_nilai": "80",
    "keluhan_guru": ["Kurang fokus", "Hiperaktif"]
  },
  "lampiran": {
    "hasil_eeg_url": "",
    "hasil_bera_url": "",
    "hasil_ct_scan_url": "",
    "program_terapi_3bln_url": "",
    "hasil_psikologis_psikiatris_url": "",
    "keterangan_tambahan": "Data lengkap untuk testing"
  }
}
```

## Response

### Success Response (201 Created)
```json
{
  "status": "success",
  "message": "Data anak berhasil dibuat",
  "data": {
    "anak": {
      "id": "uuid",
      "nomor_anak": "YAMET-2025-0001",
      "full_name": "Ahmad Fadillah Putra",
      "nick_name": "Fadil",
      "birth_date": "2018-05-15T00:00:00.000Z",
      "birth_place": "Jakarta",
      "kewarganegaraan": "Indonesia",
      "agama": "Islam",
      "anak_ke": 1,
      "sekolah_kelas": "TK B",
      "status": "AKTIF",
      "tanggal_pemeriksaan": "2025-01-15T00:00:00.000Z",
      "mulai_terapi": "2025-01-20T00:00:00.000Z",
      "created_at": "2025-01-15T00:00:00.000Z",
      "updated_at": "2025-01-15T00:00:00.000Z",
      "user_created": {
        "id": "uuid",
        "full_name": "Admin User"
      },
      "ayah": [...],
      "ibu": [...],
      "survey_awal": {...},
      "riwayat_kehamilan": {...},
      "riwayat_kelahiran": {...},
      "riwayat_imunisasi": {...},
      "riwayat_setelah_lahir": {...},
      "perkembangan_anak": {...},
      "perilaku_oral_motor": {...},
      "pola_makan": {...},
      "perkembangan_sosial": {...},
      "pola_tidur": {...},
      "penyakit_diderita": {...},
      "hubungan_keluarga": {...},
      "riwayat_pendidikan": {...},
      "pemeriksaan_sebelumnya": [...],
      "terapi_sebelumnya": [...],
      "lampiran": {...}
    },
    "transaction_summary": {
      "main_steps": [
        {
          "step": "create_anak",
          "status": "success",
          "anak_id": "uuid"
        }
      ],
      "related_data_steps": [
        {
          "step": "survey_awal",
          "status": "success"
        },
        {
          "step": "ayah",
          "status": "success"
        }
      ],
      "total_related_records_created": 15
    }
  },
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
      "code": "too_small",
      "received": ""
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

#### Database Error (500)
```json
{
  "status": "error",
  "message": "Gagal menyimpan data anak",
  "error_type": "DATABASE_TRANSACTION_ERROR",
  "details": "Connection timeout",
  "transaction_rolled_back": true,
  "timestamp": "2025-01-15T00:00:00.000Z"
}
```

## Notes

1. **Nomor Anak**: Akan di-generate otomatis oleh backend dalam format `YAMET-YYYY-XXXX`
2. **Transaction**: Semua data akan disimpan dalam satu transaksi database
3. **Rollback**: Jika ada error, semua data akan di-rollback
4. **Validation**: Menggunakan Zod schema untuk validasi data
5. **Error Handling**: Detail error handling untuk memudahkan debugging
6. **Related Data**: Semua data terkait (ayah, ibu, riwayat, dll) bersifat optional
7. **Date Format**: Gunakan format `YYYY-MM-DD` untuk semua field tanggal
8. **Email Validation**: Email ayah dan ibu akan divalidasi formatnya
9. **Array Fields**: Field array seperti `keluhan_orang_tua` bisa berisi multiple string values
10. **Boolean Fields**: Gunakan `true`/`false` untuk field boolean 