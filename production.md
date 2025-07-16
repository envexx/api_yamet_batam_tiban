# Production Deployment Guide

Panduan ini menjelaskan langkah-langkah yang perlu dilakukan setelah setup aplikasi di production (misal: setelah deploy di Coolify, Railway, Vercel, VPS, dsb).

---

## 1. Pastikan Semua Setup Selesai
- Environment variable sudah diatur (lihat `.env.example` atau `README_ENV.md`).
- Docker volume untuk upload file sudah dikonfigurasi jika menggunakan Docker (lihat dokumentasi upload).
- Semua dependensi sudah terinstall (`npm ci` atau `npm install`).

---

## 2. Jalankan Migrasi Database
Setelah aplikasi terdeploy, **wajib** menjalankan migrasi database agar struktur tabel sesuai dengan schema terbaru.

**Perintah:**
```sh
npx prisma migrate deploy
```
- Perintah ini akan menjalankan semua migrasi yang belum dijalankan di database production.
- Aman dijalankan berkali-kali (idempotent).

---

## 3. (Opsional) Jalankan Seeder
Jika ingin mengisi data awal (misal: admin default, data master, dsb), jalankan seeder setelah migrasi.

**Perintah:**
```sh
npx prisma db seed
```
- Seeder hanya perlu dijalankan **sekali** setelah deploy awal, atau jika ada perubahan data seed.
- Pastikan script seeder (`prisma/seed.ts`) sudah sesuai kebutuhan.

---

## 4. Ringkasan Alur
1. Deploy aplikasi ke production.
2. Jalankan migrasi:
   ```sh
   npx prisma migrate deploy
   ```
3. (Opsional) Jalankan seeder:
   ```sh
   npx prisma db seed
   ```
4. Aplikasi siap digunakan.

---

## FAQ
- **Q: Apakah cukup hanya `npx prisma migrate deploy`?**
  - Ya, jika hanya ingin update struktur database.
  - Jalankan seeder hanya jika butuh data awal.
- **Q: Kapan seeder dijalankan?**
  - Setelah migrasi, dan hanya jika butuh data default/master.
- **Q: Apakah perlu restart aplikasi setelah migrate/seed?**
  - Tidak wajib, kecuali ada perubahan environment atau kode.

---

**Catatan:**
- Jangan lupa backup database sebelum migrasi di production.
- Untuk detail lebih lanjut, cek dokumentasi Prisma dan README project. 