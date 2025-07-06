# Environment Variables untuk Deploy Production (Coolify)

Copy dan masukkan variable berikut ke pengaturan Environment Variables di dashboard Coolify Anda (atau file .env jika diperlukan).

## Template Environment Variables

```
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=2
DATABASE_URL=postgres://postgres:Q2Bq4D5ogVwKGWIhFDNh4blgwUerKPlrQqwFbWvAAjWj9sdMZpJKcmFmO15Zyv1l@scggcko80sk8gkg00ckogs0c:5432/postgres
JWT_SECRET=ISI_RANDOM_STRING_MIN_32_KARAKTER
LOG_LEVEL=info
NEXT_PUBLIC_API_URL=https://api.yametbatamtiban.id
NODE_ENV=production
PORT=3000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
CORS_ORIGIN=https://admin.yametbatamtiban.id,http://admin.yametbatamtiban.id
```

## Penjelasan Masing-masing Variable

- **DATABASE_POOL_MAX / DATABASE_POOL_MIN**: Jumlah maksimal/minimal koneksi pool ke database.
- **DATABASE_URL**: URL koneksi ke database PostgreSQL Anda.
- **JWT_SECRET**: Secret key untuk JWT, WAJIB random & minimal 32 karakter. Ganti dengan string acak Anda sendiri!
- **LOG_LEVEL**: Level log aplikasi (info/debug/error).
- **NEXT_PUBLIC_API_URL**: URL API backend, digunakan di frontend jika perlu.
- **NODE_ENV**: Harus diisi `production` untuk mode production.
- **PORT**: Port aplikasi (default 3000).
- **RATE_LIMIT_MAX_REQUESTS**: Maksimal request per window (rate limit).
- **RATE_LIMIT_WINDOW_MS**: Window rate limit dalam milidetik (900000 = 15 menit).
- **CORS_ORIGIN**: Daftar origin frontend yang diizinkan akses API, pisahkan dengan koma jika lebih dari satu.

## Cara Pakai di Coolify
1. Buka dashboard Coolify Anda.
2. Pilih service/project yang ingin diatur.
3. Masuk ke tab **Environment Variables**.
4. Masukkan variable di atas satu per satu (Key dan Value).
5. Klik **Save/Update**.
6. Redeploy atau restart service agar variable terbaca.

---

**JANGAN** share file ini ke publik jika sudah berisi data sensitif!

Jika butuh bantuan generate JWT_SECRET random, gunakan perintah berikut di terminal:
```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
``` 