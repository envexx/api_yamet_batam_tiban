# Dokumentasi API Setting Aplikasi (AppConfig)

Endpoint ini digunakan frontend untuk mengambil dan mengubah konfigurasi dasar aplikasi seperti nama aplikasi, logo, dan skema warna.

## Endpoint

```
GET /api/setting-aplikasi
PUT /api/setting-aplikasi
```

---

## GET /api/setting-aplikasi
Mengambil data konfigurasi aplikasi.

### Response jika data ada:
```json
{
  "status": "success",
  "data": {
    "appName": "Nama Aplikasi",
    "logoUrl": "https://.../logo.png",
    "colorSchema": "#123456"
  }
}
```

### Response jika data belum ada:
```json
{
  "status": "error",
  "message": "Konfigurasi aplikasi belum diatur"
}
```

---

## PUT /api/setting-aplikasi
Mengubah atau membuat konfigurasi aplikasi. Jika data belum ada, akan dibuat baru.

### Body (JSON):
```json
{
  "appName": "Nama Aplikasi",
  "logoUrl": "https://.../logo.png",
  "colorSchema": "#123456"
}
```

Semua field **wajib diisi**.

### Response sukses:
```json
{
  "status": "success",
  "message": "Konfigurasi aplikasi berhasil disimpan",
  "data": {
    "appName": "Nama Aplikasi",
    "logoUrl": "https://.../logo.png",
    "colorSchema": "#123456"
  }
}
```

### Response error validasi:
```json
{
  "status": "error",
  "message": "Data tidak valid",
  "errors": [ ... ]
}
```

---

## Penjelasan Field
- `appName`: Nama aplikasi/organisasi (string)
- `logoUrl`: URL logo aplikasi (string, bisa link ke file di public/uploads)
- `colorSchema`: Skema warna utama aplikasi (string, misal hex code)

---

## Catatan
- Jika GET belum ada data, frontend bisa menampilkan form input default dan mengirim PUT untuk membuat data pertama kali.
- Hanya ada satu data konfigurasi (singleton). 

---

## UPLOAD LOGO APLIKASI

### Endpoint
```
POST /api/setting-aplikasi/upload-logo
```

### Cara Pakai
- Kirim file gambar (logo) dengan form-data, field: `file`
- Hanya mendukung: jpg, jpeg, png, webp, svg
- Response akan mengembalikan url file logo yang bisa dipakai di field `logoUrl` pada AppConfig

### Contoh Request (cURL)
```bash
curl -X POST \
  -F "file=@/path/to/logo.png" \
  http://localhost:3000/api/setting-aplikasi/upload-logo
```

### Contoh Response
```json
{
  "status": "success",
  "url": "/uploads/logo/1721234567890-logo.png"
}
```

### Langkah Integrasi
1. Upload gambar logo ke endpoint di atas.
2. Ambil url dari response (`url`), lalu gunakan sebagai nilai `logoUrl` saat update/insert AppConfig (PUT /api/setting-aplikasi). 