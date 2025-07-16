# Best Practice Penggunaan Session Akses (JWT Rolling Session) untuk Frontend

## 1. Alur Otentikasi

### A. Login
- Frontend mengirim email/phone & password ke endpoint `/api/auth/login`.
- Backend mengembalikan:
  - `accessToken` (berlaku 25 menit) di response body.
  - `refreshToken` (berlaku 1 jam, rolling) di-set otomatis oleh backend di httpOnly cookie.

### B. Akses API
- Frontend mengirimkan `accessToken` di header setiap request API yang butuh otentikasi:
  ```
  Authorization: Bearer <accessToken>
  ```
- Selama access token valid, user bisa akses API tanpa login ulang.

### C. Access Token Expired
- Jika API mengembalikan error 401 (Unauthorized) karena access token expired:
  1. Frontend otomatis memanggil endpoint `/api/auth/refresh-token` (POST, tanpa body).
  2. Backend akan:
     - Mengecek refresh token dari httpOnly cookie.
     - Jika valid & belum expired, backend mengirimkan access token baru (25 menit) dan refresh token baru (1 jam, rolling) di httpOnly cookie.
  3. Frontend menyimpan access token baru dan mengulangi request API yang gagal.

### D. Refresh Token Expired
- Jika refresh token juga expired (user benar-benar tidak aktif 1 jam):
  - Endpoint `/api/auth/refresh-token` akan mengembalikan error 401.
  - Frontend harus menghapus access token dari memory dan redirect user ke halaman login.

---

## 2. Penyimpanan Token
- **Access Token:**
  Simpan di memory (state management, context, atau variable JS). **Jangan** simpan di localStorage/sessionStorage untuk keamanan (XSS).
- **Refresh Token:**
  Tidak perlu di-handle manual oleh frontend, karena sudah di-set oleh backend di httpOnly cookie (tidak bisa diakses JS, aman dari XSS).

---

## 3. Contoh Alur di Frontend (Pseudocode/React)

```js
// Saat login:
const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
const data = await res.json();
if (data.status === 'success') {
  setAccessToken(data.data.accessToken); // simpan di state/context
  // refreshToken sudah otomatis di cookie
}

// Saat request API:
async function fetchWithAuth(url, options = {}) {
  let accessToken = getAccessToken();
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status === 401) {
    // Coba refresh token
    const refreshRes = await fetch('/api/auth/refresh-token', { method: 'POST', credentials: 'include' });
    const refreshData = await refreshRes.json();
    if (refreshData.status === 'success') {
      setAccessToken(refreshData.data.accessToken);
      // Ulangi request API dengan access token baru
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshData.data.accessToken}`,
        },
      });
    } else {
      // Refresh token expired, redirect ke login
      logout();
      return;
    }
  }
  return res;
}
```
- **credentials: 'include'** wajib saat fetch refresh token agar cookie dikirim.

---

## 4. Logout
- Frontend bisa memanggil endpoint logout (jika ada) untuk menghapus refresh token di cookie (opsional).
- Hapus access token dari memory/context.

---

## 5. Keamanan
- Jangan simpan refresh token di localStorage/sessionStorage.
- Selalu gunakan httpOnly cookie untuk refresh token.
- Access token hanya di memory, hapus saat logout/expired.

---

## 6. Error Handling
- Jika dapat error 401 dari API:
  - Coba refresh token.
  - Jika gagal, redirect ke login.

---

## 7. Ringkasan Alur
1. Login → dapat access token (body) & refresh token (cookie)
2. Kirim access token di header setiap request
3. Jika access token expired, refresh otomatis pakai cookie
4. Jika refresh token expired, user harus login ulang

---

## 8. Contoh Request
### Login
```js
POST /api/auth/login
Body: { email, password }
Response: { accessToken, user }
Set-Cookie: refreshToken=...; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict
```
### Refresh Token
```js
POST /api/auth/refresh-token
(no body)
Cookie: refreshToken=... (otomatis dikirim browser)
Response: { accessToken }
Set-Cookie: refreshToken=...; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict
```

---

## 9. Catatan
- Frontend tidak perlu tahu isi refresh token (tidak bisa diakses JS).
- Access token bisa di-decode untuk payload user (jika perlu).

---

Jika butuh contoh kode lebih detail (misal React, Next.js, Vue, dsb), silakan minta ke tim backend. 